import angular from "angular";
import template from "./tabs.html";
import debounce from "lodash/debounce";
import "./array.from.polyfill";

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
	$ctrl.registeredTabs = new Map;

	$ctrl.$onInit = function () {
		$window.addEventListener("resize", debounce(testBounds, 500));
		contentElm = $element[0].querySelector("[role='tablist']");
	};

	$ctrl.registerTab = function (tab) {
		$ctrl.registeredTabs.set(tab.uuid, tab);
		updateAll();
	};
	
	$ctrl.deregisterTab = function (tab) {
		$ctrl.registeredTabs.delete(tab.uuid);
		updateAll();
	};

	$ctrl.handleTabUpdate = function (tab) {
		updateAll();
	};

	var updateAll = function () {
		buildList();
		testBounds();
		updateTabs();
	};

	var buildList = function () {
		$ctrl.tabsList = Array.from(angular.element(contentElm).find("tab"))
			.map(function (tabElement) {
				return tabElement.id;
			})
			.filter(function (id) {
				return (Array.from($ctrl.registeredTabs.keys())).find(function (registeredTabId) {
					return registeredTabId === id;
				});
			});
	};

	var updateTabs = function () {
		$ctrl.tabsList.forEach(function (tabId) {
			if ($ctrl.focusedTab === tabId) {
				var link = document.querySelector("#" + tabId + " a");
				if (document.activeElement !== link) {
					link.focus();
				}
			}
		});
	};

	var testBounds = function () {
		if ($ctrl.timeout) $timeout.cancel($ctrl.timeout);
		if (contentElm) contentElm.classList.add("tabs-content--measuring");
		$ctrl.timeout = $timeout(function () {
			$ctrl.isVertical = (contentElm && contentElm.scrollWidth > contentElm.clientWidth);
			contentElm.classList.remove("tabs-content--measuring");
		});
	};
	$ctrl.handleFocus = function(tab, event) {
		$ctrl.focusedTab = tab.uuid;
		updateTabs();
	};
	$ctrl.handleKeyDown = function(tab, event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
		case keys.right:
			if (!$ctrl.isVertical) {
				incrementTab(1);
			}
			break;
		case keys.left:
			if (!$ctrl.isVertical) {
				incrementTab(-1);
			}
			break;
		case keys.down:
			if ($ctrl.isVertical) {
				incrementTab(1); 
			}
			break;
		case keys.up:
			if ($ctrl.isVertical) {
				incrementTab(-1); 
			}
			break;
		case keys.home:
			focusFirstTab();
			break;
		case keys.end:
			focusLastTab();
			break;
		default:
			return;
		}
	};

	function incrementTab (int) {
		var index = $ctrl.tabsList.findIndex(function (tabId) {
			return tabId === $ctrl.focusedTab;
		});
		var targetId = $ctrl.tabsList[index + int];
		if (targetId) {
			$ctrl.focusedTab = targetId;
			updateTabs();
		}
	}
	function focusFirstTab () {
		var targetId = $ctrl.tabsList[0];
		if (targetId) {
			$ctrl.focusedTab = targetId;
			updateTabs();
		}
	}

	function focusLastTab () {
		var targetId = $ctrl.tabsList[$ctrl.tabsList.length - 1];
		if (targetId) {
			$ctrl.focusedTab = targetId;
			updateTabs();
		}
	}

}
