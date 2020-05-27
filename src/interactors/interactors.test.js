import Cloud, * as cloudMocks from '@cesarbr/knot-fog-connector-knot-cloud';
import RegisterDevice from './RegisterDevice';
import UnregisterDevice from './UnregisterDevice';

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

  test('should execute correctly when unregistering a thing from cloud', async () => {
    const cloud = new Cloud();
    const unregisterDevice = new UnregisterDevice(cloud);
    await unregisterDevice.execute(mockThing);
    expect(cloudMocks.mockRemoveDevice).toHaveBeenCalled();
  });

  test('should execute without errors when the unregistration of a thing from the cloud fails', async () => {
    const cloud = new Cloud({ removeDeviceErr: 'fail to unregister thing' });
    const unregisterDevice = new UnregisterDevice(cloud);
    await unregisterDevice.execute(mockThing);
    expect(cloudMocks.mockRemoveDevice).toHaveBeenCalled();
  });
});
