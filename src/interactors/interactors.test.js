import Cloud, * as cloudMocks from '@cesarbr/knot-fog-connector-knot-cloud';
import RegisterDevice from './RegisterDevice';
import UnregisterDevice from './UnregisterDevice';
import UpdateSchema from './UpdateSchema';
import UpdateConfig from './UpdateConfig';
import PublishData from './PublishData';

jest.mock('@cesarbr/knot-fog-connector-knot-cloud');

const mockThing = {
  id: 'abcdef1234568790',
  name: 'my-device',
  schema: [
    {
      sensorId: 0,
      typeId: 65521,
      valueType: 3,
      unit: 0,
      name: 'bool-sensor',
    },
  ],
  config: [
    {
      sensorId: 0,
      change: true,
      timeSec: 10,
      lowerThreshold: 1000,
      upperThreshold: 3000,
    },
  ],
};
const mockData = [
  {
    sensorId: 0,
    value: true,
  },
];

describe('Interactors', () => {
  beforeEach(() => {
    cloudMocks.mockAddDevice.mockClear();
    cloudMocks.mockRemoveDevice.mockClear();
    cloudMocks.mockUpdateSchema.mockClear();
    cloudMocks.mockUpdateConfig.mockClear();
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

  test("should execute correctly when updating a thing's schema on cloud", async () => {
    const cloud = new Cloud();
    const updateSchema = new UpdateSchema(cloud);
    await updateSchema.execute(mockThing);
    expect(cloudMocks.mockUpdateSchema).toHaveBeenCalled();
  });

  test("should execute without errors when updating a thing's schema on cloud fails", async () => {
    const cloud = new Cloud({
      updateSchemaErr: "fail to update thing's schema",
    });
    const updateSchema = new UpdateSchema(cloud);
    await updateSchema.execute(mockThing);
    expect(cloudMocks.mockUpdateSchema).toHaveBeenCalled();
  });

  test("should execute correctly when updating a thing's config on cloud", async () => {
    const cloud = new Cloud();
    const updateConfig = new UpdateConfig(cloud);
    await updateConfig.execute(mockThing);
    expect(cloudMocks.mockUpdateConfig).toHaveBeenCalled();
  });

  test("should execute without errors when updating a thing's config on cloud fails", async () => {
    const cloud = new Cloud({
      updateConfigErr: "fail to update thing's config",
    });
    const updateConfig = new UpdateConfig(cloud);
    await updateConfig.execute(mockThing);
    expect(cloudMocks.mockUpdateConfig).toHaveBeenCalled();
  });

  test("should execute correctly when publishing a thing's data to the cloud", async () => {
    const cloud = new Cloud();
    const publishData = new PublishData(cloud);
    await publishData.execute(mockThing.id, mockData);
    expect(cloudMocks.mockPublishData).toHaveBeenCalled();
  });

  test("should execute without errors when publishing a thing's data to cloud fails", async () => {
    const cloud = new Cloud({ publishDataErr: "fail to publish thing's data" });
    const publishData = new PublishData(cloud);
    await publishData.execute(mockThing.id, mockData);
    expect(cloudMocks.mockPublishData).toHaveBeenCalled();
  });
});
