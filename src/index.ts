import { ColumnDef, createTable, getCoreRowModel, Table, TableState } from "@tanstack/table-core"

type Person = {
  id: string
  firstName: string
  lastName: string
  age: number
}

const persons: Array<Person> = [
  {
    id: "1",
    firstName: "Luise",
    lastName: "Müller",
    age: 34,
  },
  {
    id: "2",
    firstName: "Hugo",
    lastName: "Mayer",
    age: 54,
  },
  {
    id: "3",
    firstName: "Holger",
    lastName: "Bauer",
    age: 13,
  },
]

class MyComponent extends HTMLElement {
  private table?: Table<Person>

  constructor() {
    super()

    this.attachShadow({ mode: "open" })

    const defaultColumns: ColumnDef<Person>[] = [
      {
        accessorKey: "firstName",
        header: () => "Firstname",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorKey: "lastName",
        header: () => "Lastname",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorKey: "age",
        header: () => "Age",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
    ]

    const initialState: TableState = {
      columnFilters: [],
      columnOrder: [],
      columnPinning: {
        left: [],
        right: [],
      },
      columnSizing: {},
      columnSizingInfo: {
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        columnSizingStart: [],
        isResizingColumn: false,
      },
      columnVisibility: {},
      expanded: {},
      globalFilter: undefined,
      grouping: [],
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      rowSelection: {},
      sorting: [],
    }

    this.table = createTable({
      columns: defaultColumns,
      get data() {
        return persons
      },
      onStateChange: () => {
        console.log("state change")
      },
      getCoreRowModel: getCoreRowModel(),
      state: initialState,
      renderFallbackValue: null,
    })
  }

  connectedCallback() {
    const shadow = this.shadowRoot

    if (shadow && this.table) {
      const tableRoot = document.createElement("table")
      const thead = document.createElement("thead")
      tableRoot.appendChild(thead)

      this.table.getHeaderGroups().forEach((headerGroup) => {
        const tr = document.createElement("tr")
        thead.appendChild(tr)

        headerGroup.headers.forEach((header) => {
          const th = document.createElement("th")
          tr.appendChild(th)

          if (!header.isPlaceholder) {
            const headerFn = header.column.columnDef.header

            if (headerFn) {
              if (typeof headerFn === "function") {
                th.textContent = headerFn(header.getContext())
              } else {
                th.textContent = headerFn
              }
            }
          }
        })
      })

      const tbody = document.createElement("tbody")
      tableRoot.appendChild(tbody)

      this.table.getRowModel().rows.forEach((row) => {
        const tr = document.createElement("tr")
        tbody.appendChild(tr)

        row.getVisibleCells().forEach((cell) => {
          const td = document.createElement("td")
          tr.appendChild(td)
          const value = cell.getValue()

          if (typeof value === "string") {
            td.textContent = value
          }
        })
      })
      shadow.appendChild(tableRoot)
    }
  }
}

window.customElements.define("app-hello", MyComponent)
