import Cloud, * as cloudMocks from '@cesarbr/knot-fog-connector-knot-cloud';
import RegisterDevice from './RegisterDevice';

jest.mock('@cesarbr/knot-fog-connector-knot-cloud');

const mockThing = {
  id: 'abcdef1234568790',
  name: 'my-device',
};

describe('Interactors', () => {
  beforeEach(() => {
    cloudMocks.mockAddDevice.mockClear();
    cloudMocks.mockRemoveDevice.mockClear();
    cloudMocks.mockUpdateSchema.mockClear();
    cloudMocks.mockPublishData.mockClear();
  });

  test('should execute correctly when registering a new thing on cloud', async () => {
    const cloud = new Cloud();
    const registerDevice = new RegisterDevice(cloud);
    await registerDevice.execute(mockThing);
    expect(cloudMocks.mockAddDevice).toHaveBeenCalled();
  });

  test('should execute without errors when the registration of a new thing fails', async () => {
    const cloud = new Cloud({ addDeviceErr: 'fail to register thing' });
    const registerDevice = new RegisterDevice(cloud);
    await registerDevice.execute(mockThing);
    expect(cloudMocks.mockAddDevice).toHaveBeenCalled();
  });
});
