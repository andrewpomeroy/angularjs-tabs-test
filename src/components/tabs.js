import angular from "angular";
import template from "./tabs.html";
import debounce from "lodash/debounce";

export default {
	bindings: {
		prop: "<",
	},
	template: template,
	transclude: true,
	controller: TabsController
};

var keys = {
	end: 35,
	home: 36,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	delete: 46,
	enter: 13,
	space: 32
};

TabsController.$inject = ["$scope", "$element", "$timeout", "$window"];
function TabsController($scope, $element, $timeout, $window) {
	var $ctrl = this;
	var contentElm;

	$ctrl.$onInit = function () {
		$window.addEventListener("resize", debounce(testBounds, 500));
		contentElm = $element[0].querySelector("[role='tablist']");
	};

	$ctrl.registerTab = function (tab) {
		// console.log("registering", tab, tab.uuid);
		testBounds();
	};
	
	$ctrl.deregisterTab = function (tab) {
		// console.log("deregistering", tab, tab.uuid);
		testBounds();
	};

	$ctrl.updateTab = function (tab) {
		// console.log("updating", tab, tab.uuid);
		testBounds();
	};

	var testBounds = function () {
		if ($ctrl.timeout) $timeout.cancel($ctrl.timeout);
		if (contentElm) contentElm.classList.add("tabs-content--measuring");
		$ctrl.timeout = $timeout(function () {
			// console.log(contentElm.scrollWidth, contentElm.clientWidth);
			$ctrl.isOverflowing = (contentElm && contentElm.scrollWidth > contentElm.clientWidth);
			contentElm.classList.remove("tabs-content--measuring");
		});
	};

}
