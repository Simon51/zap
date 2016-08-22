//Premier test d'une class AngularJS

var app = angular.module('app',['nvd3','ui.bootstrap']);



app.controller("ReportCtrl",function($scope, $http) {
	
	//Variables du controller
    $scope.titre = "Rapport ZAP";
	$scope.presentation="Liste des vulnérabilités de l'application";	
	
	
	$scope.report = $http.get("ReportForSpiderWithActiveScan-17-11-07.xml",
            {
	    transformResponse: function (cnv) {
	      var x2js = new X2JS();
	      var aftCnv = x2js.xml_str2json(cnv);
	      $scope.zapReport = $scope.traitementReport(aftCnv);
		  return $scope.zapReport;
	    }
	  })
	    .success(function (response) {
		console.log($scope.zapReport);
	  });
	console.log($scope.zapReport);
	  
//	$scope.HighRisk = function(zapReport) {
//		var compteur =0;
//		alert(zapReport[1]);
//			for (i = 0; i < zapReport.length;i++) {
//				for(a =0; a <zapReport.alerts.alertitem.length; a ++) {
//					if(zapReport.alerts.alertitem[a] === "1") {
//						compteur++;
//					}
//				}
//			}
//			return compteur;
//	};
//
//	$scope.High = $scope.HighRisk($scope.report);
//	
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
