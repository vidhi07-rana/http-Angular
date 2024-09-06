import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, take, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = inject(HttpClient)
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
   return  this.fetchPlaces('http://localhost:3000/places', 'Something went wrong while fetching the available places. Please try again later.'   )
  }

  loadUserPlaces() {
return this.fetchPlaces('http://localhost:3000/user-places','Something went wrong while fetching your favorite places. Please try again later.'
  ).pipe(tap({
    next:(userPlaces)=> this.userPlaces.set(userPlaces)
  }))
 
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces =this.userPlaces()
    if(!prevPlaces.some((p) => p.id === place.id)){

      this.userPlaces.set([...prevPlaces, place])
    }
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id,
    }).pipe(catchError(error=>{
      this.userPlaces.set(prevPlaces)
      return throwError(()=> new Error('Failed to stored selected places.'))
    }))
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string , errorMessage: string){
     // const subscription= this.httpClient.get<{places: Place[]}>('http://localhost:3000/places', {
  //   observe:'response'
  //  }).subscribe({
  //     next: (response)=>{
  //       console.log(response)
  //       console.log(response.body?.places)
  //     }
  //   })  
  
    return this.httpClient
    .get<{places: Place[]}>(url)
    .pipe(
     map((resData)=> resData.places, catchError((error)=>{
       console.log(error);
       return throwError(()=> new Error(errorMessage))
     }))
    )
  }
}
