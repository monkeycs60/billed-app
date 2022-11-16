/**
 * @jest-environment jsdom
 */


import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store";
import { localStorageMock } from "../__mocks__/localStorage";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import NewBillUI from "../views/NewBillUI";
import NewBill from "../containers/NewBill";
import Router from "../app/Router";

jest.mock("../app/store", () => mockStore);

const setup = async () => {
  // Create an object with the adaquate properties
  Object.defineProperty(window, "localStorage", { value: localStorageMock });

  // Connect as an employee
  window.localStorage.setItem(
    "user",
    JSON.stringify({ type: "Employee", email: "a@a" })
  );

  // Create a div as in the DOM
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  // Add the div with append
  document.body.append(root);

  // Initialise router function
  router();

  // Call back root function
  return root;
};

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      await setup();
      // Surfing on newbill page
     window.onNavigate(ROUTES_PATH.NewBill);

      // TEST 1: L'icone a gauche a un background plus clair
      const icon = screen.getByTestId("icon-window");
      expect(icon).toHaveStyle("background-color: #3b4752");
    });
    
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})
