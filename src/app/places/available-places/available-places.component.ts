import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { catchError, map, throwError } from 'rxjs';

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
  private httpClient = inject(HttpClient)
private destoryRef = inject(DestroyRef);

// constructor(private httpClient : HttpClient){}

ngOnInit(){
  this.isFetching.set(true)
 const subscription= this.httpClient
 .get<{places: Place[]}>('http://localhost:3000/places')
 .pipe(
  map((resData)=> resData.places, catchError((error)=>{
    console.log(error);
    return throwError(()=> new Error('Something went wrong while fetching the available places. Please try again later.'))
  }))
 )
 .subscribe({
  // const subscription= this.httpClient.get<{places: Place[]}>('http://localhost:3000/places', {
  //   observe:'response'
  //  }).subscribe({
  //     next: (response)=>{
  //       console.log(response)
  //       console.log(response.body?.places)
  //     }
  //   })  

  next: (places)=>{
this.places.set(places)
  },
  error:(error: Error)=>{
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
}
