//Premier test d'une class AngularJS

var app = angular.module('app',['nvd3','ui.bootstrap']);



app.controller("ReportCtrl",function($scope, $http) {
	
	//Variables du controller
    $scope.titre = "Rapport ZAP";
	$scope.presentation="Liste des vulnérabilités de l'application";	

	//$scope.risk = $scope.HighRisk($scope.zapReport);
	
	
	
	 $http.get("ReportForSpiderWithActiveScan-17-11-07.xml",
            {
    transformResponse: function (cnv) {
      var x2js = new X2JS();
      var aftCnv = x2js.xml_str2json(cnv);
      $scope.zapReport = $scope.traitementReport(aftCnv);
	 
	  return aftCnv;
	  
    }
  })
    .success(function (response) {
	console.log($scope.zapReport);
  });
  
	$scope.traitementReport = function (report) {
		var newReport = []
		angular.forEach(report.OWASPZAPReport.site,function(site, key){
			if (site.alerts!==""){
				if (!angular.isArray(site.alerts.alertitem)){
					var tmp = site.alerts.alertitem;
					
					site.alerts.alertitem = [];
					site.alerts.alertitem.push(tmp);
				}
				
				newReport.push(site);
			}
		});
		return newReport;
	};
	
	/*$scope.HighRisk = function(zapReport) {
		var compteur =0;
		angular.forEach(zapReport.OWASPZAPReport.site, function(site, key) {
			angular.forEach(site.alerts,function(alerts, key) {
				if (alerts.alertitem.riskcode === "1") {
					compteur++;
					console.log(compteur);
				}
			});
		});
		return compteur;
	};
	*/
});

app.controller('CollapseDemoCtrl', function ($scope) {
  $scope.isCollapsed = true;
});




app.controller('MainCtrl', function($scope) {
  $scope.options = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "High",
                y: 3
            },
            {
                key: "Medium",
                y: 2
            },
            {
                key: "Low",
                y: 9
            }
        ];
});
