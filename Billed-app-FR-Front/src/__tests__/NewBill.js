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
import router from "../app/Router";

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

    describe("When I upload a file with a wrong image format", () => {
      test("Then the file input should be emptied", async () => {
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
            store: mockStore, localStorage
          });
        // Surfing on newbill page
        // window.onNavigate(ROUTES_PATH.NewBill);

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
        // Simulate the change event
        // await waitFor(() => {
        //   fireEvent.change(fileInput, {
        //     target: {
        //       files: [fileToUpload],
        //     },
        //   });
        // });

        

        // Check that the file input is empty
        // expect(fileInput.files.length).toBe(0);
        // Upload the file
       userEvent.upload(fileInput, fileToUpload);
       expect(handleChangeFile).toHaveBeenCalled();
        // expect(fileInput.files.length).toBe(0);
          // expect(fileInput.files[0]).not.toStrictEqual(fileInput);
          expect(fileInput.files[0].name).not.toBe("chucknorris.pdf");
        // Check if the fileInput does not contains fileToUpload name
        // expect(fileInput.files[0].name).not.toBe(fileToUpload.name);
      
        
      });
    })
})
})

