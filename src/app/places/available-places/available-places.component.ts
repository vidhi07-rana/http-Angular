import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],

})
export class AvailablePlacesComponent implements  OnInit {
  places = signal<Place[] | undefined>(undefined);
isFetching = signal(false)
isError = signal('')
private placeService = inject(PlacesService)
private destoryRef = inject(DestroyRef);

// constructor(private httpClient : HttpClient){}

ngOnInit(){
  this.isFetching.set(true)
 const subscription= this.placeService.loadAvailablePlaces().subscribe({
  next: (places)=>{
this.places.set(places)
  },
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
onSelect(selectedPlace : Place ){
  const subscription = this.placeService.addPlaceToUserPlaces(selectedPlace).subscribe({
    next:(resData)=> console.log(resData)
})

this.destoryRef.onDestroy(()=>{
  subscription.unsubscribe()
})
}
}
