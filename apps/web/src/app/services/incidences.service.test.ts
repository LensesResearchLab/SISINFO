import { createIncidence, closeIncidence, getAllIncidences } from "./incidences.service";
import { Incidence } from "../types/entities/incidence.type";
import handleRequest from "./handle-request";

jest.mock("./handle-request");
const mockedHandleRequest = handleRequest as jest.Mock;

describe("incidences.service", () => {
  const mockIncidence: Incidence = {
    id: "1",
    type: "network",
    description: "No internet connection",
    isClosed: false,
    date: "2025-05-27",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createIncidence", () => {
    it("should call handleRequest with the correct data and return the created incidence", async () => {
      mockedHandleRequest.mockResolvedValue(mockIncidence);

      const result = await createIncidence(mockIncidence);

      expect(handleRequest).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: "POST",
        body: JSON.stringify(mockIncidence),
      }));
      expect(result).toEqual(mockIncidence);
    });
  });

  describe("closeIncidence", () => {
    it("should call handleRequest with PATCH method and return the closed incidence", async () => {
      const closedIncidence = { ...mockIncidence, isClosed: true };
      mockedHandleRequest.mockResolvedValue(closedIncidence);

      const result = await closeIncidence("1");

      expect(handleRequest).toHaveBeenCalledWith(expect.stringContaining("/1"), expect.objectContaining({
        method: "PATCH",
      }));
      expect(result).toEqual(closedIncidence);
    });
  });

  describe("getAllIncidences", () => {
    it("should return an array of incidences", async () => {
      const mockIncidences: Incidence[] = [mockIncidence];
      mockedHandleRequest.mockResolvedValue(mockIncidences);

      const result = await getAllIncidences();

      expect(handleRequest).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: "GET",
      }));
      expect(result).toEqual(mockIncidences);
    });
  });
});
