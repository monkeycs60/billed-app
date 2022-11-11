/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/localStorage.js";

import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //  Ajout de l'expect
      expect(windowIcon.classList).toContain("active-icon");         
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.getAttribute("data-testid"));
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
    describe("When I am on Bills Page and I click on the icon eye", () => {
      test("A modal should open", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = null;
        const billContainer = new Bills({
          document,
          onNavigate,
          store,
          localStorage: localStorageMock,
        });
        //simulation de l'ouverture de la modal
        $.fn.modal = jest.fn();
        //simulation du clic sur l'icone oeil
        const handleClickIconEye = jest.fn(() => {billContainer.handleClickIconEye});
        const iconEye = screen.getAllByTestId("icon-eye")[0];
        iconEye.addEventListener("click", handleClickIconEye);
        fireEvent.click(iconEye);
        expect(handleClickIconEye).toHaveBeenCalled();
        expect($.fn.modal).toHaveBeenCalled();

      });
    });
    describe("When I am on Bills Page and I click on the new bill button", () => {
      test("A new bill page should be opened", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = null;
        const mockBills = new Bills({
          document,
          onNavigate,
          store,
          localStorage: localStorageMock,
        });
        //simulation du clic sur le bouton new bill
        const handleClickNewBill = jest.fn(() => {mockBills.handleClickNewBill;});
        const newBillBtn = screen.getByTestId("btn-new-bill");
        newBillBtn.addEventListener("click", handleClickNewBill);
        fireEvent.click(newBillBtn);
        expect(handleClickNewBill).toHaveBeenCalled();
        expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
      });
    });

})

