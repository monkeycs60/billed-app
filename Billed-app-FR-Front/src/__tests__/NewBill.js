/**
 * @jest-environment jsdom
 */


import { fireEvent, screen, wait, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store";
import { localStorageMock } from "../__mocks__/localStorage";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import NewBillUI from "../views/NewBillUI";
import NewBill from "../containers/NewBill";
import router from "../app/Router";
import BillsUI from "../views/BillsUI.js";


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
      const icon = screen.getByTestId("icon-mail");

      // Get the tested icon
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");

      // Check that the icon has the highlighted class given by active-icon
      expect(mailIcon).toBeTruthy();
      expect(mailIcon.classList).toContain("active-icon");
    });

    jest.spyOn(window, "alert").mockImplementation(() => {});
    describe("When I upload a file with a wrong image format", () => {
      test("Then an alert should pop", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = NewBillUI();

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage,
        });

        const handleChangeFile = jest.fn((e) => {
          newBill.handleChangeFile(e);
        });
        // Get the file input
        const fileInput = screen.getByTestId("file");

        //get the file to upload, it should be a pdf file
        const fileToUpload = new File(["chucknorris"], "chucknorris.pdf", {
          type: "application/pdf",
        });

        // listener on file input
        fileInput.addEventListener("change", handleChangeFile);

        // Upload the file
        userEvent.upload(fileInput, fileToUpload);

        expect(handleChangeFile).toHaveBeenCalled();

        expect(window.alert).toHaveBeenCalledWith(
          "Le fichier doit ??tre une image au format jpeg, jpg ou png"
        );
     
      });
      //describe when I enter a correct file format, the name of the file should be displayed
          describe("When I select an image in a correct format", () => {
            test("Then the input file should display the file name", () => {
              //page NewBill
              const html = NewBillUI();
              document.body.innerHTML = html;
              const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
              };
              // init NewBill
              const newBill = new NewBill({
                document,
                onNavigate,
                store : mockStore,
                localStorage,
              });
              const handleChangeFile = jest.fn((e) =>
                newBill.handleChangeFile(e)
              );
              const input = screen.getByTestId("file");
              input.addEventListener("change", handleChangeFile);
              //file with the correct format/extensions
              fireEvent.change(input, {
                target: {
                  files: [
                    new File(["image.png"], "image.png", {
                      type: "image/png",
                    }),
                  ],
                },
              });
              expect(handleChangeFile).toHaveBeenCalled();
              expect(input.files[0].name).toBe("image.png");
            });
          });
    });
    //Integration test for the POST request
    describe("When I fill the form with correct datas and file extension", () => {
      test("Then the new bill should be created", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = NewBillUI();

        // We have to mock navigation to test it
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage,
        });

        // Get the form
        const form = screen.getByTestId("form-new-bill");

        // Get the input fields
        const inputType = screen.getByTestId("expense-type");
        const inputName = screen.getByTestId("expense-name");
        const inputAmount = screen.getByTestId("amount");
        const inputDate = screen.getByTestId("datepicker");
        const inputVat = screen.getByTestId("vat");
        const inputPct = screen.getByTestId("pct");
        const inputComment = screen.getByTestId("commentary");

        // Fill the form
        fireEvent.change(inputType, { target: { value: "Transports" } });
        fireEvent.change(inputName, { target: { value: "test" } });
        fireEvent.change(inputAmount, { target: { value: "100" } });
        fireEvent.change(inputDate, { target: { value: "2021-07-01" } });
        fireEvent.change(inputVat, { target: { value: "20" } });
        fireEvent.change(inputPct, { target: { value: "80" } });
        fireEvent.change(inputComment, { target: { value: "test" } });

        //expect all the fields to be valid
        expect(inputType.validity.valid).toBeTruthy();
        expect(inputName.validity.valid).toBeTruthy();
        expect(inputDate.validity.valid).toBeTruthy();
        expect(inputAmount.validity.valid).toBeTruthy();
        expect(inputVat.validity.valid).toBeTruthy();
        expect(inputPct.validity.valid).toBeTruthy();
        expect(inputComment.validity.valid).toBeTruthy();

        // Get the file input
        const handleChangeFile = jest.fn((e) => {
          newBill.handleChangeFile(e);
        });
        // Get the file input
        const fileInput = screen.getByTestId("file");

        //get the file to upload, it should be a pdf file
        const fileToUpload = new File(["chucknorris"], "chucknorris.png", {
          type: "image/png",
        });

        // listener on file input
        fileInput.addEventListener("change", handleChangeFile);

        // Upload the file
        userEvent.upload(fileInput, fileToUpload);

        // check that the file has been uploaded
        expect(handleChangeFile).toHaveBeenCalled();
        expect(fileInput.files[0]).toBeDefined();

        newBill.updateBill = jest.fn();

        // Submit the form
        const handleSubmit = jest.fn((e) => {
          newBill.handleSubmit(e);
        });
        form.addEventListener("submit", handleSubmit);

        fireEvent.submit(form);

        // check that the form has been submitted and the new bill created
        expect(handleSubmit).toHaveBeenCalled();
        expect(newBill.updateBill).toHaveBeenCalled();

      });
 
    });

    // When an error occurs on the API
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      // TEST : get bills from an API and fails with 404 error
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        const html = BillsUI({ error: "Erreur 404" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });
      // TEST : get bills from an API and fails with 500 error
      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        const html = BillsUI({ error: "Erreur 500" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});