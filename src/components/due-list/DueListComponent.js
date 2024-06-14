"use client";

import CustomersDueList from "./CustomersDueList";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";

export default function DueListComponent({ customerData }) {
  const dueCustomer = customerData.filter(customer => customer.dueAmount > 0)

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" color="primary" variant="bordered">
        <Tab key="customers" title="Customers">
          <Card>
            <CardBody>
              <CustomersDueList customerData={dueCustomer} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="retailers" title="Retailers">
          <Card>
            <CardBody>
              <CustomersDueList customerData={dueCustomer} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
