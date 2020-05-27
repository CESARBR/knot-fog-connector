export const mockAddDevice = jest.fn();
export const mockRemoveDevice = jest.fn();
export const mockUpdateSchema = jest.fn();
export const mockPublishData = jest.fn();

export default jest.fn().mockImplementation((options = {}) => {
  if (options.addDeviceErr) {
    mockAddDevice.mockRejectedValue(Error(options.addDeviceErr));
  } else {
    mockAddDevice.mockResolvedValue();
  }

  if (options.removeDeviceErr) {
    mockRemoveDevice.mockRejectedValue(Error(options.removeDeviceErr));
  } else {
    mockRemoveDevice.mockResolvedValue();
  }

  if (options.updateSchemaErr) {
    mockUpdateSchema.mockRejectedValue(Error(options.updateSchemaErr));
  } else {
    mockUpdateSchema.mockResolvedValue();
  }

  if (options.publishDataErr) {
    mockPublishData.mockRejectedValue(Error(options.publishDataErr));
  } else {
    mockPublishData.mockResolvedValue();
  }

  return {
    addDevice: mockAddDevice,
    removeDevice: mockRemoveDevice,
    updateSchema: mockUpdateSchema,
    publishData: mockPublishData,
  };
});
