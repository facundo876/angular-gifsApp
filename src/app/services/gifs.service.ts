import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SearchGifsResponse, Gif } from '../gifs/interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private api_key:string = 'OisJoHXRaKOGNlgXcuUzDvO5WyAVfCqb';
  private servicioUrl:string = 'https://api.giphy.com/v1/gifs';

  private _historial: string[] = [];
  public resultados : Gif[] = [];

  constructor( private http: HttpClient ){

    if(localStorage.getItem('historial')){
      this._historial = JSON.parse( localStorage.getItem( 'historial' )! )
    }

    if(localStorage.getItem('gifs')){
      this.resultados = JSON.parse( localStorage.getItem( 'gifs' )! )
    }

  }

  get historial(){
    return [...this._historial]
  }
  
  buscarGifs( query:string ){
    
    query = query.trim().toLocaleLowerCase();

    if(!this._historial.includes( query )){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0, 10);
    }

    const params = new HttpParams()
                      .set('api_key', this.api_key)
                      .set('q', query)
                      .set('limit', '10')

    localStorage.setItem('historial', JSON.stringify( this.historial ));

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
      .subscribe( (res) => {
        this.resultados = res.data; 
        localStorage.setItem('gifs', JSON.stringify( res.data ));
      });

    
  }
}
