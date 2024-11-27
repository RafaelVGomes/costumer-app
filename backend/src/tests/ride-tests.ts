// import { Request, Response } from 'express';
// import * as rideService from '../services/ride-service';

// describe('POST /ride/estimate', () => {
//   let mockRequest: Partial<Request>;
//   let mockResponse: Partial<Response>;
//   let jsonMock: jest.Mock;

//   beforeEach(() => {
//     jsonMock = jest.fn();
//     mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: jsonMock,
//     };
//   });

//   afterEach(() => {
//     jest.clearAllMocks(); // Clear mocks after each test
//   });

//   it('should return 400 if startLocation or endLocation is missing', () => {
//     mockRequest = { body: {} };

//     calculateEstimate(mockRequest as Request, mockResponse as Response);

//     // Ensure the response status is 400 and error message is in Portuguese
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(jsonMock).toHaveBeenCalledWith({
//       error: 'startLocation e endLocation são obrigatórios.',
//     });
//   });

//   it('should call ride-service with correct parameters and return 200', () => {
//     const startLocation = { latitude: 1.23, longitude: 4.56 };
//     const endLocation = { latitude: 7.89, longitude: 0.12 };
//     const mockEstimate = {
//       distance: 1000,
//       duration: '10 minutos',
//       polyline: 'mockPolyline',
//     };

//     jest
//       .spyOn(rideService, 'calculateRideEstimate')
//       .mockReturnValueOnce(mockEstimate as any);

//     mockRequest = { body: { startLocation, endLocation } };

//     calculateEstimate(mockRequest as Request, mockResponse as Response);

//     // Ensure the service is called with correct parameters
//     expect(rideService.calculateRideEstimate).toHaveBeenCalledWith(
//       startLocation,
//       endLocation
//     );

//     // Ensure the response status is 200 and returns the estimate in Portuguese
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//     expect(jsonMock).toHaveBeenCalledWith({ estimate: mockEstimate });
//   });

//   it('should return 500 if ride-service throws an error', () => {
//     const startLocation = { latitude: 1.23, longitude: 4.56 };
//     const endLocation = { latitude: 7.89, longitude: 0.12 };

//     jest
//       .spyOn(rideService, 'calculateRideEstimate')
//       .mockImplementationOnce(() => {
//         throw new Error('Mock error');
//       });

//     mockRequest = { body: { startLocation, endLocation } };

//     calculateEstimate(mockRequest as Request, mockResponse as Response);

//     // Ensure the response status is 500 and error message is in Portuguese
//     expect(mockResponse.status).toHaveBeenCalledWith(500);
//     expect(jsonMock).toHaveBeenCalledWith({
//       error: 'Ocorreu um erro ao calcular a estimativa.',
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });
// });
