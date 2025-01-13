import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";

// API REFERENCE: https://metmuseum.github.io/
export interface Object {
  id: number;
  title: string;
}

export interface Department {
  id: number;
  name: string;
}

@Injectable({
  providedIn: "root",
})
export class MetService {
  private url = "https://collectionapi.metmuseum.org/public/collection/v1";

  // https://collectionapi.metmuseum.org/public/collection/v1/objects/[objectID]
  // https://collectionapi.metmuseum.org/public/collection/v1/departments

  constructor(private http: HttpClient) {}

  getObjectById(id: number): Observable<Object> {
    return this.http.get<Object>(`${this.url}/objects/${id}`).pipe(
      tap((d) => console.log(d)),
      map((q: any) => {
        return q as Object;
      })
    );
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.url}/departments`).pipe(
      tap((d) => console.log(d)),
      map((result: any) => {
        const { departments } = result;
        return (departments as any[]).map((d) => ({
          id: d.departmentId,
          name: d.displayName,
        }));
      })
    );
  }
}