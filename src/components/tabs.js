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

TabsController.$inject = ["$element", "$timeout", "$window"];
function TabsController($element, $timeout, $window) {
	var $ctrl = this;

	$ctrl.$onInit = function () {
		$window.addEventListener("resize", debounce(testBounds, 500));
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
		$ctrl.noWrap = true;
		$timeout(function () {
			var content = $element[0].querySelector("[tabs-content]");
			console.log(content.scrollWidth, content.clientWidth);
			$ctrl.isOverflowing = (content && content.scrollWidth > content.clientWidth);
		});
	};

}
