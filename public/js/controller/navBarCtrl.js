function navBarCtrl($scope, $location) 
{ 
    $scope.isActive = function (viewLocation) { 
    	var location = $location.url();
    	return location.indexOf(viewLocation) !== -1 || (location.indexOf('profile/') === -1 && viewLocation.indexOf('dashboard') !== -1);
    };
    $scope.location = $location.absUrl();
}