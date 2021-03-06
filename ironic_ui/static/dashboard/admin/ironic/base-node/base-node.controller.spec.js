/*
 * Copyright 2017 Cray Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  describe('horizon.dashboard.admin.ironic.base-node', function () {
    var ironicBackendMockService, uibModalInstance;
    var ctrl = {};

    beforeEach(module('horizon.dashboard.admin.ironic'));

    beforeEach(module('horizon.framework.util'));

    beforeEach(module(function($provide) {
      $provide.value('$uibModal', {});
    }));

    beforeEach(module(function($provide) {
      uibModalInstance = {
        dismiss: jasmine.createSpy()
      };
      $provide.value('$uibModalInstance', uibModalInstance);
    }));

    beforeEach(module(function($provide) {
      $provide.value('horizon.framework.widgets.toast.service',
                     {});
    }));

    beforeEach(module('horizon.app.core.openstack-service-api'));

    beforeEach(inject(function($injector) {
      ironicBackendMockService =
        $injector.get('horizon.dashboard.admin.ironic.backend-mock.service');
      ironicBackendMockService.init();

      var controller = $injector.get('$controller');
      controller('BaseNodeController', {ctrl: ctrl});
    }));

    afterEach(function() {
      ironicBackendMockService.postTest();
    });

    it('controller should be defined', function () {
      expect(ctrl).toBeDefined();
    });

    it('base construction', function () {
      expect(ctrl.drivers).toBeNull();
      expect(ctrl.images).toBeNull();
      expect(ctrl.loadingDriverProperties).toBe(false);
      expect(ctrl.driverProperties).toBeNull();
      expect(ctrl.driverPropertyGroups).toBeNull();
      expect(ctrl.modalTitle).toBeDefined();
      angular.forEach(ctrl.propertyCollections, function(collection) {
        expect(Object.getOwnPropertyNames(collection).sort()).toEqual(
          PROPERTY_COLLECTION_PROPERTIES.sort());
      });
      expect(ctrl.propertyCollections)
        .toContain(jasmine.objectContaining({id: "properties"}));
      expect(ctrl.propertyCollections)
        .toContain(jasmine.objectContaining({id: "extra"}));
      expect(ctrl.node).toEqual({
        name: null,
        driver: null,
        driver_info: {},
        properties: {},
        extra: {},
        network_interface: null,
        resource_class: null});
      expect(Object.getOwnPropertyNames(ctrl).sort()).toEqual(
        BASE_NODE_CONTROLLER_PROPERTIES.sort());
    });

    it('_loadDrivers', function () {
      ctrl._loadDrivers();
      ironicBackendMockService.flush();
      expect(ctrl.drivers).toEqual(ironicBackendMockService.getDrivers());
    });

    it('_getImages', function () {
      ctrl._getImages();
      ironicBackendMockService.flush();
      expect(ctrl.images).toEqual(ironicBackendMockService.getImages());
    });

    it('cancel', function () {
      ctrl.cancel();
      expect(uibModalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

  });
})();
