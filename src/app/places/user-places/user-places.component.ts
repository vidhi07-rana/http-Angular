import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';
import { ErrorModalComponent } from "../../shared/modal/error-modal/error-modal.component";

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent, ErrorModalComponent],
})
export class UserPlacesComponent implements OnInit {
  isError = signal('')
  isFetching = signal(false);
  
private placeService = inject(PlacesService)
  private destoryRef = inject(DestroyRef);
  places = this.placeService.loadedUserPlaces;
  


  ngOnInit(){
    this.isFetching.set(true)
   const subscription= this.placeService.loadUserPlaces()
   .subscribe({
    // const subscription= this.httpClient.get<{places: Place[]}>('http://localhost:3000/places', {
    //   observe:'response'
    //  }).subscribe({
    //     next: (response)=>{
    //       console.log(response)
    //       console.log(response.body?.places)
    //     }
    //   })  
  
    
    error:(error: Error )=>{
  this.isError.set(error.message)
    },
    complete:()=>{
       this.isFetching.set(false)
    }
    })
    this.destoryRef.onDestroy(()=>{
      subscription.unsubscribe()
    })
  }
  onRemovePlace(place:Place){
const Subscription= this.placeService.removeUserPlace(place).subscribe();

this.destoryRef.onDestroy(()=>{
  Subscription.unsubscribe()
})
  }
}
