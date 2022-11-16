/**
 * @jest-environment jsdom
 */

// import { fireEvent, screen, waitFor, userEvent } from "@testing-library/dom";
// import BillsUI from "../views/BillsUI.js";
// import { bills } from "../fixtures/bills.js";
// import { row } from "../views/BillsUI.js";
// import Bills from "../containers/Bills.js";
// import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
// import { localStorageMock } from "../__mocks__/localStorage.js";
// import mockStore from "../__mocks__/store.js";
// import router from "../app/Router.js";


import "@testing-library/jest-dom";
import store from "../__mocks__/store";
import userEvent from "@testing-library/user-event";
import { screen, waitFor, getByTestId, fireEvent } from "@testing-library/dom";
import Bills from "../containers/Bills.js";
import BillsUI from "../views/BillsUI.js";
import router from "../app/Router.js";
import { bills } from "../fixtures/bills.js";
import mockStore from "../__mocks__/store";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { row } from "../views/BillsUI.js";


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
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      await setup();
     
      // TEST 1: L'icone a gauche a un background plus clair

      // Surfing on Bills page
      window.onNavigate(ROUTES_PATH.Bills);

      // Get the tested icon
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      // Check that the icon has the highlighted class given by active-icon
      expect(windowIcon).toBeTruthy();
      expect(windowIcon.classList).toContain("active-icon");
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.getAttribute("data-testid"));
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
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
      const handleClickIconEye = jest.fn(() => {
        billContainer.handleClickIconEye;
      });
      // const modaleFile = document.getElementById("modaleFile");
      const iconEye = screen.getAllByTestId("icon-eye")[0];
      iconEye.addEventListener("click", handleClickIconEye);
      userEvent.click(iconEye);
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
      const handleClickNewBill = jest.fn(() => {
        mockBills.handleClickNewBill;
      });
      const newBillBtn = screen.getByTestId("btn-new-bill");
      newBillBtn.addEventListener("click", handleClickNewBill);
      fireEvent.click(newBillBtn);
      expect(handleClickNewBill).toHaveBeenCalled();
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });
  });
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I am Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
        localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();

        window.onNavigate(ROUTES_PATH.Bills);
      
        const contentAvailable = await screen.findByText("Mes notes de frais");
        expect(contentAvailable).toBeTruthy();

        const tbody = await screen.findByTestId("tbody");
        expect(tbody).toBeTruthy();
        expect(tbody.children.length).toBe(4);

    });
    describe("When an error occurs on API", () => {
        beforeEach(() => {
          jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
// ERROR 404
    test("fetches bills from an API and fails with 404 message error", async () => {
     mockStore.bills.mockImplementationOnce(() => {
       return {
         list: () => {
           return Promise.reject(new Error("Erreur 404"));
         },
       };
     });
     window.onNavigate(ROUTES_PATH.Bills);
     await new Promise(process.nextTick);
     const message = await screen.getByText(/Erreur 404/);
     expect(message).toBeTruthy();
    });
// ERROR 500
    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });

      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
});
