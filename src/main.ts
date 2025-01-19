import "./style.css";
import $ from "jquery";

const state = {
  optionIds: [] as number[],
  optionsId: 0,
  optionsError: "",
  fieldIds: [] as number[],
  fieldsId: 0,
  fieldErrors: [] as string[],
  getNewOptionId() {
    const id = this.optionsId++;
    this.optionIds.push(id);
    return id;
  },
  getNewFieldId() {
    const id = this.fieldsId++;
    this.fieldIds.push(id);
    return id;
  },
  resetInputForm() {
    state.optionIds = [];
    state.optionsId = 0;
  },
};
// =============STATE UTILS==============================

const removeOptionsFields = () => {
  $("#option-fields").html("");
};

const setOptionFieldsToStartState = () => {
  const fieldType = $("#input-form-dropdown").val();
  removeOptionsFields();
  state.resetInputForm();
  if (fieldType === "select") {
    handleAddInputOption();
  }
};

const emptyNameField = () => {
  $("#name-field").val("");
};

// =============FORM GENERATION==========================
$(
  $("#input-form").on("submit", (e) => {
    e.preventDefault();
    const filedId = state.getNewFieldId();
    const fieldType = $("#input-form-dropdown").val();
    const fieldName = $(`#name-field`).val() as string;
    let input;
    if (fieldType === "select") {
      input = makeSelectElement(filedId);
    } else {
      input = $(`<input id="g-input-${filedId}" required ></input>`);
    }
    let inputSection = makeInputSection(input, fieldName, filedId);
    $("#generate-table-form-inputs").append(inputSection);
    setOptionFieldsToStartState();
    emptyNameField();
    handleGenerateTableFormVisibility();
  })
);

$(
  $("#input-form-dropdown").on("change", (e) => {
    const target = e.target as HTMLSelectElement;
    setOptionFieldsToStartState();
    if (target.value === "select") {
      console.log("here");
      $("#add-option-btn").removeClass("hidden");
      $("#select-header").removeClass("hidden");
    } else {
      removeOptionsFields();
      $("#add-option-btn").addClass("hidden");
      $("#select-header").addClass("hidden");
    }
  })
);

$(
  $("#add-option-btn").on("click", () => {
    handleAddInputOption();
  })
);

const handleGenerateTableFormVisibility = () => {
  if (state.fieldIds.length > 0) {
    $("#generate-table-form").removeClass("hidden");
  } else {
    $("#generate-table-form").addClass("hidden");
  }
};

const handleAddInputOption = () => {
  let id = state.getNewOptionId();
  $("#option-fields").append(`
    <section class="input-section" id='section-${id}' required>
      <input id='option-${id}' required></input>
    </section>
    `);
  $(`#option-${id}`).after(
    `<button type='button' class='remove-btn m-1' id='option-remove-${id}'>remove</button>`
  );
  $(`#option-remove-${id}`).on("click", () => {
    if (state.optionIds.length === 1) {
      return;
    }
    console.log(state.optionIds);
    state.optionIds = state.optionIds.filter((o) => o !== id);
    $(`#section-${id}`).remove();
  });
};

const makeSelectElement = (filedId: number) => {
  let $select = $(`<select id="g-input-${filedId}" ></select>`);
  state.optionIds.forEach((oId) => {
    const inputValue = $(`#option-${oId}`).val();
    $select.append(
      `<option id='option-${filedId}-${oId}' value='${inputValue}'>${inputValue}</option>`
    );
  });
  return $select;
};

const makeInputSection = (
  $input: JQuery<HTMLElement>,
  fieldName: string,
  id: number
) => {
  const inputSectionId = `generate-table-input-section-${id}`;
  const $inputSection = $(
    `<section id="${inputSectionId}" class="input-section flex-row p-1" required></section>`
  );
  $($inputSection).append(
    `<label id='g-name-${id}' value='${fieldName}' class="input-label" for="input-${id}">${fieldName}</label>`
  );
  $($inputSection).append($input);
  const $removeButton = $(`<button class="remove-btn">Remove</button>`).on(
    "click",
    () => {
      $(`#${inputSectionId}`).remove();
      state.fieldIds = state.fieldIds.filter((i) => id !== i);
      handleGenerateTableFormVisibility();
    }
  );
  $inputSection.append($removeButton);

  return $inputSection;
};

//===============TABLE GENERATION===================
$(
  $("#generate-table-form").on("submit", (e) => {
    e.preventDefault();
    let data = getDataForTable();
    generateTable(data);
    $("#table-header").removeClass("hidden");
  })
);

const generateTable = (data: { name: string; value: string }[]) => {
  $("#generated-table-container").empty();

  const table = $("<table class='table'></table>");

  const header = $("<tr></tr>").append("<th>Name</th>", "<th>Value</th>");
  table.append(header);

  data.forEach((row) => {
    const tableRow = $("<tr></tr>");
    tableRow.append(`<td>${row.name}</td>`);
    tableRow.append(`<td>${row.value}</td>`);
    table.append(tableRow);
  });

  $("#generated-table-container").append(table);
};

const getDataForTable = () => {
  console.log(state.fieldIds);
  const data: { name: string; value: string }[] = [];

  state.fieldIds.forEach((f) => {
    const value = $(`#g-input-${f}`).val() as string;
    const name = $(`#g-name-${f}`).html() as string;
    console.log(name);
    console.log(value);
    data.push({ name, value });
  });
  return data;
};
