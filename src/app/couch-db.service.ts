import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouchDbService {

  readonly baseURL = 'http://localhost:5984/facedetectiondb';
  readonly username = 'rajkumar'; 
  readonly password = 'rajraina45'; 

  constructor(private http: HttpClient) { }

  getAllDocuments(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`)
    });
    console.log(`${this.baseURL}/_all_docs`, { headers })
    return this.http.get<any>(`${this.baseURL}/_design/userface/_view/face`, { headers });
  }

  getDocumentById(docId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`)
    });

    return this.http.get<any>(`${this.baseURL}/${docId}`, { headers });
  }
  putData(data:any,id:string):Observable<any>
  {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`),
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(`${this.baseURL}/${id}`, data, { headers })
    
  }

}
