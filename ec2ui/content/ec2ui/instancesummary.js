var ec2_InstanceSummary = {
    init : function() {
      var instanceList = window.arguments[0];
      var endpoint = window.arguments[1];

      var data = {
        total: instanceList.length,
        state: {},
        instanceType: {},
        group: {},
        availabilityZone: {},
      };

      function inc(key, hash) {
        var num = (hash[key] || 0);
        num++;
        hash[key] = num;
      }

      for (var i = 0; i < instanceList.length; i++) {
        var instance = instanceList[i];
        var groupList = (instance.groupList || []);
        inc(instance.state, data.state);
        inc(instance.instanceType, data.instanceType);

        for (var j = 0; j < groupList.length; j++) {
          inc(groupList[j], data.group);
        }

        var az = data.availabilityZone[instance.placement.availabilityZone];

        if (!az) {
          az = {
            total: 0,
            state: {},
            instanceType: {},
            group: {}
          };

          data.availabilityZone[instance.placement.availabilityZone] = az;
        }

        az.total++;
        inc(instance.state, az.state);
        inc(instance.instanceType, az.instanceType);

        for (var j = 0; j < groupList.length; j++) {
          inc(groupList[j], az.group);
        }
       }

      document.getElementById("ec2ui.summary.total").value = data.total;
      document.getElementById("ec2ui.summary.linux_monthly_amount").value = '$ ' + __calcLinuxMonthlyAmount__(data.instanceType, endpoint);
      document.getElementById("ec2ui.summary.windows_monthly_amount").value = '$ ' + __calcWindowsMonthlyAmount__(data.instanceType, endpoint);
      var amounts = __calcRILinuxMonthlyAmount__(data.instanceType, endpoint);
      document.getElementById("ec2ui.summary.ri_linux_monthly_amount").value = '$ ' + amounts[2] + ' (1yr: $ ' + amounts[0] + ' / 3yr: $ ' + amounts[1] + ')';
      amounts = __calcRIWindowsMonthlyAmount__(data.instanceType, endpoint);
      document.getElementById("ec2ui.summary.ri_windows_monthly_amount").value = '$ ' + amounts[2] + ' (1yr: $ ' + amounts[0] + ' / 3yr: $ ' + amounts[1] + ')';
      document.getElementById("ec2ui.summary.state").value = JSON.stringify(data.state, null, "  ");
      document.getElementById("ec2ui.summary.instanceType").value = JSON.stringify(data.instanceType, null, "  ");
      document.getElementById("ec2ui.summary.group").value = JSON.stringify(data.group, null, "  ");
      document.getElementById("ec2ui.summary.availabilityZone").value = JSON.stringify(data.availabilityZone, null, "  ");
    }
}
