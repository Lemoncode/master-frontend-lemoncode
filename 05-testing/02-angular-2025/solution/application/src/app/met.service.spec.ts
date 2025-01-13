import { Department, MetService } from "./met.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { asyncData, asyncError } from "./async-observable-helpers";

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

  it("should return an error when the server returns a 404", (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: "test 404 error",
      status: 404,
      statusText: "Not Found",
    });
  
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
  
    service.getDepartments().subscribe({
      next: (departments) => done.fail("expected and error, not departments"),
      error: ({ error }) => {
        expect(error).toContain("test 404 error");
        done();
      },
    });
  });
});