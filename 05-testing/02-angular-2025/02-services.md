# Testing Services

```bash
npx ng g s value --skip-tests
```

Update `value.service.spec.ts`

```ts
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ValueService {
  constructor() {}

  getValue(): string {
    return "real value";
  }

  getObservableValue(): Observable<string> {
    return of("observable value");
  }

  getPromiseValue(): Promise<string> {
    return Promise.resolve("promise value");
  }
}
```

## Services with Dependencies

```bash
npx ng g s master
```

Update `master.service.ts`

```ts
import { Injectable } from "@angular/core";
import { ValueService } from "./value.service";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  constructor(private valueService: ValueService) {}

  getValue() {
    return this.valueService.getValue();
  }
}
```

We can test this kind of services on different ways. Angular gives us support to deal with dependencies, but we can relay on different techniques out of Angular goodies.

Update `master.service.spec.ts`

```ts
import { MasterService } from "./master.service";
import { ValueService } from "./value.service";

class FakeValueService {
  getValue() {
    return "faked service value";
  }
}

describe("MasterService", () => {
  let service: MasterService;

  it("#getValue should return real value from the real service", () => {
    service = new MasterService(new ValueService());
    expect(service.getValue()).toBe("real value");
  });

  it("#getValue should return faked value from a fakeService", () => {
    service = new MasterService(new FakeValueService() as ValueService);
    expect(service.getValue()).toBe("faked service value");
  });

  it("#getValue should return faked value from a fake object", () => {
    const fake = { getValue: () => "fake value" };
    service = new MasterService(fake as ValueService);
    expect(service.getValue()).toBe("fake value");
  });

  it("#getValue should return value from a spy", () => {
    const valueServiceSpy = jasmine.createSpyObj("ValueService", ["getValue"]);
    valueServiceSpy.getValue.and.returnValue("stub value");

    service = new MasterService(valueServiceSpy);

    expect(service.getValue())
      .withContext("service returned stub value")
      .toBe("stub value");
    expect(valueServiceSpy.getValue.calls.count())
      .withContext("spy method was called once")
      .toBe(1);
    expect(valueServiceSpy.getValue.calls.mostRecent().returnValue).toBe(
      "stub value"
    );
  });
});
```

```bash
npx ng test --include app/master.service.spec.ts
```

These standard testing techniques are great for unit testing services in isolation.

However, you almost always inject services into application classes using Angular dependency injection and you should have tests that reflect that usage pattern. Angular testing utilities make it straightforward to investigate how injected services behave.

## Testing HTTP services

Data services that make HTTP calls to remote servers typically inject and delegate to the Angular `HttpClient` service for XHR calls.

You can test a data service with an injected `HttpClient` spy as you would test any service with a dependency.

```bash
npx ng g s met
```

Update `met.service.ts`

```ts
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
```

Create `app/async-observable-helpers.ts`

```ts
import { defer } from "rxjs";

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}
```

Update `app/met.service.spec.ts`

```ts
import { Department, MetService } from "./met.service";
import { HttpClient } from "@angular/common/http";
import { asyncData } from "./async-observable-helpers";

describe("MetService", () => {
  let service: MetService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
    service = new MetService(httpClientSpy);
  });

  it("should return expected departments (HttpClient called once)", (done: DoneFn) => {
    const departmentsModel: {
      departments: { departmentId: number; displayName: string }[];
    } = {
      departments: [
        { departmentId: 1, displayName: "Foo" },
        { departmentId: 2, displayName: "Boo" },
      ],
    };

    const expectedDepartments: Department[] = [
      { id: 1, name: "Foo" },
      { id: 2, name: "Boo" },
    ];

    httpClientSpy.get.and.returnValue(asyncData(departmentsModel));

    service.getDepartments().subscribe({
      next: (departments) => {
        expect(departments)
          .withContext("expected departments")
          .toEqual(expectedDepartments);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).withContext("one call").toBe(1);
  });
});
```

```bash
npx ng test --include app/met.service.spec.ts
```

We can even test expected errors.

```diff
....
-import { HttpClient } from "@angular/common/http";
+import { HttpClient, HttpErrorResponse } from "@angular/common/http";
-import { asyncData } from "./async-observable-helpers";
+import { asyncData, asyncError } from "./async-observable-helpers";
....
+ it("should return an error when the server returns a 404", (done: DoneFn) => {
+   const errorResponse = new HttpErrorResponse({
+       error: "test 404 error",
+       status: 404,
+       statusText: "Not Found",
+   });
+
+   httpClientSpy.get.and.returnValue(asyncError(errorResponse));
+
+   service.getDepartments().subscribe({
+       next: (departments) => done.fail("expected and error, not departments"),
+       error: ({ error }) => {
+       expect(error).toContain("test 404 error");
+       done();
+       },
+   });
});
```

## HttpClientTestingModule

Extended interactions between a data service and the `HttpClient` can be complex and difficult to mock with spies.

The `HttpClientTestingModule` can make these testing scenarios more manageable.

Follow [HTTP Client Testing](https://angular.dev/guide/http/testing) for detail guide for using `HttpClientTestingModule`.