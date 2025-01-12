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