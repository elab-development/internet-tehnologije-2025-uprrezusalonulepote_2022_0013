import { pgTable, serial, text, numeric, integer } from "drizzle-orm/pg-core";

export const Service = pgTable("service", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: numeric("price").notNull(),
});

export const Employee = pgTable("employee", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

//veza n->n; jedan zaposleni moze da ima vise usluga, jedna usluga je vezana za vise zaposlenih
export const EmployeeService = pgTable("employee_service", {
  employee_id: integer("employee_id")
    .notNull()
    .references(() => Employee.id),
  service_id: integer("service_id")
    .notNull()
    .references(() => Service.id),
});
