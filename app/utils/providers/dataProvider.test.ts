import { describe, it, expect, beforeEach } from "vitest";
import axiosMockAdapter from "axios-mock-adapter";
import httpClient from "./dataProvider"; // Adjust the path accordingly

describe("httpClient", () => {
  let mock: axiosMockAdapter;

  beforeEach(() => {
    mock = new axiosMockAdapter(httpClient);
  });

  it("should handle GET request", async () => {
    // Arrange
    const responseData = { message: "success" };
    mock.onGet("/test-endpoint").reply(200, responseData);

    // Act
    const response = await httpClient.get("/test-endpoint");

    // Assert
    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  it("should handle POST request", async () => {
    // Arrange
    const requestData = { key: "value" };
    const responseData = { message: "created" };
    mock.onPost("/test-endpoint", requestData).reply(201, responseData);

    // Act
    const response = await httpClient.post("/test-endpoint", requestData);

    // Assert
    expect(response.status).toBe(201);
    expect(response.data).toEqual(responseData);
  });

  // Add more tests as needed
});
