"use client";

import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import axiosInstance from "@/services/axiosInstance";
import { Fragment, useEffect, useState } from "react";
import CustomerReceiptPDF from "../customers/customerReceiptPDF";
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import AddCustomer from "../customers/AddCustomer";
import { PlusIcon } from "@heroicons/react/24/outline";
import ModalWrapper from "../common/modal/ModalWrapper";

export default function SlideOver({
  children,
  selectedProduct,
  price,
  quantity,
  customers,
  customerDetails,
  setSelectedProduct,
}) {
  const [sum, setSum] = useState(0);
  const [open2, setOpen2] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [isValid, setIsValid] = useState(true);
  const [selected, setSelected] = useState("cash");
  const [isPDFShow, setIsPDFShow] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customer, setCustomers] = useState(customers);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  useEffect(() => {
    let ss = 0;
    let flag = false;
    selectedProduct?.map((product) => {
      ss += price[product._id] * quantity[product._id];
      if (!price[product._id] || !quantity[product._id]) {
        flag = true;
      }
    });
    setSum(ss);
    if (flag) setIsValid(false);
    else setIsValid(true);
  }, [price, quantity, selectedProduct?.length]);

  const session = useSession();

  const handleSelectionChange = (e) => {
    setSelectedCustomer(e.target.value);
  };

  const handleSubmit = () => {
    let productAttr = {
      allProduct: selectedProduct,
      priceList: price,
      quantityList: quantity,
      totalAmount: sum,
      discount: discount,
      receiveAmount: receiveAmount,
      company: session?.data?.user?._id,
      customer: selectedCustomer,
      payment_method: selected,
    };
    

    if (selectedCustomer.length === 0) {
      toast.error("Please select your customer ");
      return;
    }
    if (sum > 0 && isValid) {
      axiosInstance.post("/customers/create-bill", productAttr);
      localStorage.removeItem("product");
      setSelectedProduct(null);
      setDiscount(0);
      setReceiveAmount(0);
      toast.success("You have successfully create your bill");
    } else {
      toast.error("Please complete all product list properly");
    }
  };

  const handleDiscount = (e) => {
    if (e.target.value > sum) {
      toast.error("Discount value are not greater total amount");
    } else {
      setDiscount(e.target.value);
    }
  };
  const handleReceiveAmount = (e) => {
    let val = sum - discount;
    if (e.target.value > val) {
      toast.error("Receive amount  are not greater than total amount");
    } else {
      setReceiveAmount(e.target.value);
    }
  };
  const downloadPDF = async () => {
    try {
      setIsPDFShow(true);
      const element = document.getElementById("invoice");

      let option = {
        margin: [14, 4, 10, 4],
        padding: 0,
        filename: `Invoice.pdf`,
        image: { type: "jpeg", quality: 0.96 },
        html2canvas: {
          scale: 2,
          logging: true,
          dpi: 192,
          letterRendering: true,
        },
        jsPDF: { unit: "mm", format: "A4", orientation: "P" },
        pagebreak: { mode: "avoid-all", after: ".avoidThisRow" },
      };

      html2pdf()
        .from(element)
        .set(option)
        .toPdf()
        .get("pdf")
        .then(function (pdf) {
          console.log("Page : ", pdf.internal.getNumberOfPages());
          var totalPages = pdf.internal.getNumberOfPages();

          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(150);
            // const jmjBase64Image =
            //   "data:image/png;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuZGV2L3N2Z2pzIiB3aWR0aD0iMTUwMCIgaGVpZ2h0PSI5MzUiIHZpZXdCb3g9IjAgMCAxNTAwIDkzNSI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwtMC45MDkwOTA5MDkwOTA5OTE4LDAuMzc4NTQyNTEwMTIxNDYyOCkiPjxzdmcgdmlld0JveD0iMCAwIDM5NiAyNDciIGRhdGEtYmFja2dyb3VuZC1jb2xvcj0iI2ZmZmZmZiIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgaGVpZ2h0PSI5MzUiIHdpZHRoPSIxNTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0idGlnaHQtYm91bmRzIiB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLDAuMjQwMDAwMDAwMDAwMDA5MSwtMC4wOTk5OTk5OTk5OTk5OTQzMikiPjxzdmcgdmlld0JveD0iMCAwIDM5NS41MiAyNDcuMiIgaGVpZ2h0PSIyNDcuMiIgd2lkdGg9IjM5NS41MiI+PGc+PHN2Zz48L3N2Zz48L2c+PGc+PHN2ZyB2aWV3Qm94PSIwIDAgMzk1LjUyIDI0Ny4yIiBoZWlnaHQ9IjI0Ny4yIiB3aWR0aD0iMzk1LjUyIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLDc1LjU0NDMyLDUxLjg5MjI1MTMzMzc5NDA2NCkiPjxzdmcgdmlld0JveD0iMCAwIDI0NC40MzEzNTk5OTk5OTk5OCAxNDMuNDE1NDk3MzMyNDExODYiIGhlaWdodD0iMTQzLjQxNTQ5NzMzMjQxMTg2IiB3aWR0aD0iMjQ0LjQzMTM1OTk5OTk5OTk4Ij48Zz48c3ZnIHZpZXdCb3g9IjAgMCAyNDQuNDMxMzU5OTk5OTk5OTggMTQzLjQxNTQ5NzMzMjQxMTg2IiBoZWlnaHQ9IjE0My40MTU0OTczMzI0MTE4NiIgd2lkdGg9IjI0NC40MzEzNTk5OTk5OTk5OCI+PGc+PHN2ZyB2aWV3Qm94PSIwIDAgMjQ0LjQzMTM1OTk5OTk5OTk4IDE0My40MTU0OTczMzI0MTE4NiIgaGVpZ2h0PSIxNDMuNDE1NDk3MzMyNDExODYiIHdpZHRoPSIyNDQuNDMxMzU5OTk5OTk5OTgiPjxnPjxzdmcgdmlld0JveD0iMCAwIDI0NC40MzEzNTk5OTk5OTk5OCAxNDMuNDE1NDk3MzMyNDExODYiIGhlaWdodD0iMTQzLjQxNTQ5NzMzMjQxMTg2IiB3aWR0aD0iMjQ0LjQzMTM1OTk5OTk5OTk4Ij48ZyBpZD0idGV4dGJsb2NrdHJhbnNmb3JtIj48c3ZnIHZpZXdCb3g9IjAgMCAyNDQuNDMxMzU5OTk5OTk5OTggMTQzLjQxNTQ5NzMzMjQxMTg2IiBoZWlnaHQ9IjE0My40MTU0OTczMzI0MTE4NiIgd2lkdGg9IjI0NC40MzEzNTk5OTk5OTk5OCIgaWQ9InRleHRibG9jayI+PGc+PHN2ZyB2aWV3Qm94PSIwIDAgMjQ0LjQzMTM1OTk5OTk5OTk4IDE0My40MTU0OTczMzI0MTE4NiIgaGVpZ2h0PSIxNDMuNDE1NDk3MzMyNDExODYiIHdpZHRoPSIyNDQuNDMxMzU5OTk5OTk5OTgiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsMCwwKSI+PHN2ZyB3aWR0aD0iMjQ0LjQzMTM1OTk5OTk5OTk4IiB2aWV3Qm94PSIxLjcgLTM2LjUgNzIuMzUgNDIuNDUiIGhlaWdodD0iMTQzLjQxNTQ5NzMzMjQxMTg2IiBkYXRhLXBhbGV0dGUtY29sb3I9IiMwOTZhMmUiPjxwYXRoIGQ9Ik0yNi43IDUuOTVMMjYuNyA1Ljk1IDE0LjUgNS45NVE3Ljk1IDUuOTUgNC44MyAyLjU1IDEuNy0wLjg1IDEuNy02LjI1TDEuNy02LjI1IDEuNy0yMC4zUTEuNy0yMy4wNSAyLjUtMjUuMDggMy4zLTI3LjEgNC44NS0yOC40NUw0Ljg1LTI4LjQ1IDExLjM1LTMzLjlRMTIuOS0zNS4yIDE1LjMtMzUuODUgMTcuNy0zNi41IDIwLjk1LTM2LjVMMjAuOTUtMzYuNSAzMy4xNS0zNi41UTM0LjM1LTM2LjUgMzQuOS0zNS45NSAzNS40NS0zNS40IDM1LjQ1LTM0LjJMMzUuNDUtMzQuMiAzNS40NS0yOC4xNVEzNS40NS0yNy41IDM1LjI3LTI3LjA1IDM1LjEtMjYuNiAzNC43NS0yNi4zTDM0Ljc1LTI2LjMgMjguMjUtMjAuOVEyOC4wNS0yMC43IDI3LjYzLTIwLjU1IDI3LjItMjAuNCAyNi43LTIwLjRMMjYuNy0yMC40IDIwLjU1LTIwLjQgMjAuNTUtMTEuOTVRMjAuNTUtMTAuOSAyMS4yLTEwLjQ4IDIxLjg1LTEwLjA1IDIzLjEtMTAuMDVMMjMuMS0xMC4wNSAzMy4xNS0xMC4wNVEzNC4zNS0xMC4wNSAzNC45LTkuNSAzNS40NS04Ljk1IDM1LjQ1LTcuNzVMMzUuNDUtNy43NSAzNS40NS0xLjhRMzUuNDUtMS4xNSAzNS4yNy0wLjcgMzUuMS0wLjI1IDM0Ljc1IDAuMDVMMzQuNzUgMC4wNSAyOC4yNSA1LjQ1UTI4LjA1IDUuNjUgMjcuNjMgNS44IDI3LjIgNS45NSAyNi43IDUuOTVaTTIwLjk1IDBMMzMuMTUgMFEzNC4xIDAgMzQuNTItMC40MyAzNC45NS0wLjg1IDM0Ljk1LTEuOEwzNC45NS0xLjggMzQuOTUtNy43NVEzNC45NS04LjcgMzQuNTItOS4xMyAzNC4xLTkuNTUgMzMuMTUtOS41NUwzMy4xNS05LjU1IDIzLjEtOS41NVEyMS41NS05LjU1IDIwLjgtMTAuMTMgMjAuMDUtMTAuNyAyMC4wNS0xMS45NUwyMC4wNS0xMS45NSAyMC4wNS0yMy44NVEyMC4wNS0yNS4xIDIwLjgtMjUuNzMgMjEuNTUtMjYuMzUgMjMuMS0yNi4zNUwyMy4xLTI2LjM1IDMzLjE1LTI2LjM1UTM0LjEtMjYuMzUgMzQuNTItMjYuNzggMzQuOTUtMjcuMiAzNC45NS0yOC4xNUwzNC45NS0yOC4xNSAzNC45NS0zNC4yUTM0Ljk1LTM1LjE1IDM0LjUyLTM1LjU4IDM0LjEtMzYgMzMuMTUtMzZMMzMuMTUtMzYgMjAuOTUtMzZRMTQuNy0zNiAxMS42OC0zMy40OCA4LjY1LTMwLjk1IDguNjUtMjUuNzVMOC42NS0yNS43NSA4LjY1LTEwLjJROC42NS01IDExLjY4LTIuNSAxNC43IDAgMjAuOTUgMEwyMC45NSAwWk0yMi4wNS01TDMwLjQtNSAzMC40LTQuNSAyMi4wNS00LjVRMTcuMi00LjUgMTUuNjMtNiAxNC4wNS03LjUgMTQuMDUtMTAuOTVMMTQuMDUtMTAuOTUgMTQuMDUtMjQuOTVRMTQuMDUtMjguNSAxNS42NS0zMCAxNy4yNS0zMS41IDIyLjA1LTMxLjVMMjIuMDUtMzEuNSAzMC40LTMxLjUgMzAuNC0zMSAyMi4wNS0zMVExNy42NS0zMSAxNi4xLTI5LjYzIDE0LjU1LTI4LjI1IDE0LjU1LTI0Ljk1TDE0LjU1LTI0Ljk1IDE0LjU1LTEwLjk1UTE0LjU1LTcuNyAxNi4wNS02LjM1IDE3LjU1LTUgMjIuMDUtNUwyMi4wNS01Wk01Ni4xNSA1Ljk1TDU2LjE1IDUuOTUgNDguMDUgNS45NVE0Ni44NSA1Ljk1IDQ2LjMgNS40IDQ1Ljc1IDQuODUgNDUuNzUgMy42NUw0NS43NSAzLjY1IDQ1Ljc1LTIwLjQgMzguOS0yMC40UTM3LjctMjAuNCAzNy4xNS0yMC45NSAzNi42LTIxLjUgMzYuNi0yMi43TDM2LjYtMjIuNyAzNi42LTI4Ljc1UTM2LjYtMjkuNCAzNi43Ny0yOS44NSAzNi45NS0zMC4zIDM3LjMtMzAuNkwzNy4zLTMwLjYgNDMuNzUtMzYuMDVRNDQtMzYuMjUgNDQuNDItMzYuMzggNDQuODUtMzYuNSA0NS4zNS0zNi41TDQ1LjM1LTM2LjUgNzEuNzUtMzYuNVE3Mi45NS0zNi41IDczLjUtMzUuOTUgNzQuMDUtMzUuNCA3NC4wNS0zNC4yTDc0LjA1LTM0LjIgNzQuMDUtMjguMTVRNzQuMDUtMjcuNSA3My44Ny0yNy4wNSA3My43LTI2LjYgNzMuMzUtMjYuM0w3My4zNS0yNi4zIDY2Ljg1LTIwLjlRNjYuNjUtMjAuNyA2Ni4yMi0yMC41NSA2NS44LTIwLjQgNjUuMy0yMC40TDY1LjMtMjAuNCA2NC45LTIwLjQgNjQuOS0xLjhRNjQuOS0xLjE1IDY0LjcyLTAuNyA2NC41NS0wLjI1IDY0LjIgMC4wNUw2NC4yIDAuMDUgNTcuNyA1LjQ1UTU3LjUgNS42NSA1Ny4wNyA1LjggNTYuNjUgNS45NSA1Ni4xNSA1Ljk1Wk01NC41IDBMNjIuNiAwUTYzLjU1IDAgNjMuOTctMC40MyA2NC40LTAuODUgNjQuNC0xLjhMNjQuNC0xLjggNjQuNC0yNi4zNSA3MS43NS0yNi4zNVE3Mi43LTI2LjM1IDczLjEyLTI2Ljc4IDczLjU1LTI3LjIgNzMuNTUtMjguMTVMNzMuNTUtMjguMTUgNzMuNTUtMzQuMlE3My41NS0zNS4xNSA3My4xMi0zNS41OCA3Mi43LTM2IDcxLjc1LTM2TDcxLjc1LTM2IDQ1LjM1LTM2UTQ0LjQtMzYgNDMuOTctMzUuNTggNDMuNTUtMzUuMTUgNDMuNTUtMzQuMkw0My41NS0zNC4yIDQzLjU1LTI4LjE1UTQzLjU1LTI3LjIgNDMuOTctMjYuNzggNDQuNC0yNi4zNSA0NS4zNS0yNi4zNUw0NS4zNS0yNi4zNSA1Mi43LTI2LjM1IDUyLjctMS44UTUyLjctMC44NSA1My4xMi0wLjQzIDUzLjU1IDAgNTQuNSAwTDU0LjUgMFpNNTguOC00LjVMNTguMy00LjUgNTguMy0zMSA0OC4wNS0zMSA0OC4wNS0zMS41IDY5LjA1LTMxLjUgNjkuMDUtMzEgNTguOC0zMSA1OC44LTQuNVoiIG9wYWNpdHk9IjEiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsMCwwKSIgZmlsbD0iIzA5NmEyZSIgY2xhc3M9IndvcmRtYXJrLXRleHQtMCIgZGF0YS1maWxsLXBhbGV0dGUtY29sb3I9InByaW1hcnkiIGlkPSJ0ZXh0LTAiPjwvcGF0aD48L3N2Zz48L2c+PC9zdmc+PC9nPjwvc3ZnPjwvZz48L3N2Zz48L2c+PC9zdmc+PC9nPjwvc3ZnPjwvZz48L3N2Zz48L2c+PGc+PHBhdGggZD0iTTAgMTIzLjZjMC02OC4yNjIgNTUuMzM4LTEyMy42IDEyMy42LTEyMy42IDMzLjQ5NyAwIDYzLjg4MiAxMy4zMjUgODYuMTQzIDM0Ljk2NGwtOS41NjQgMGMtMjAuNTM0LTE3Ljc1Ni00Ny4zMDItMjguNDk3LTc2LjU3OS0yOC40OTctNjQuNjkxIDAtMTE3LjEzMyA1Mi40NDItMTE3LjEzMyAxMTcuMTMzIDAgNjQuNjkxIDUyLjQ0MiAxMTcuMTMzIDExNy4xMzMgMTE3LjEzMyAyOS4yNzcgMCA1Ni4wNDUtMTAuNzQxIDc2LjU3OS0yOC40OTdoOS41NjRjLTIyLjI2MSAyMS42MzktNTIuNjQ2IDM0Ljk2NC04Ni4xNDMgMzQuOTY0LTY4LjI2MiAwLTEyMy42LTU1LjMzOC0xMjMuNi0xMjMuNnoiIGZpbGw9IiMwOTZhMmUiIHN0cm9rZT0idHJhbnNwYXJlbnQiIGRhdGEtZmlsbC1wYWxldHRlLWNvbG9yPSJ0ZXJ0aWFyeSI+PC9wYXRoPjwvZz48L3N2Zz48L2c+PGRlZnM+PC9kZWZzPjwvc3ZnPjxyZWN0IHdpZHRoPSIzOTUuNTIiIGhlaWdodD0iMjQ3LjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgdmlzaWJpbGl0eT0iaGlkZGVuIj48L3JlY3Q+PC9nPjwvc3ZnPjwvZz48L3N2Zz4=";
            // pdf.addImage(jmjBase64Image, "PNG", 10, 8, 30, 10);
            // pdf.addImage(
            //   jmjBase64Image,
            //   "PNG",
            //   pdf.internal.pageSize.getWidth() - 40,
            //   pdf.internal.pageSize.getHeight() - 14.5,
            //   30,
            //   10
            // );
            pdf.text(
              i + "/" + totalPages + "",
              pdf.internal.pageSize.getWidth() - 110,
              pdf.internal.pageSize.getHeight() - 8
            );
          }
          return pdf;
        })
        .save();
    } catch (error) {
      console.log("esdvs", error);
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col overflow-y-auto gap-6">
        {children}
        <div className="flex flex-col md:flex-row gap-8 md:items-end">
          <div className="w-30">
            <Button
              size="md"
              color="primary"
              className="rounded-md"
              startContent={<PlusIcon height={18} strokeWidth={2} />}
              onClick={() => onOpen()}
            >
              New Customer
            </Button>
          </div>
          <Select
            label={
              <p>
                Select Customer <span className="text-danger text-md">*</span>
              </p>
            }
            labelPlacement="outside"
            variant="bordered"
            placeholder="Select customer"
            radius="sm"
            size="md"
            name="customer"
            selectedKeys={[selectedCustomer]}
            onChange={handleSelectionChange}
            classNames={{
              base: "flex justify-start",
              label: "text-sm pe-0",
              trigger: "border-1 border-neutral-300",
              value: "text-sm",
            }}
          >
            {customer.map((customer) => (
              <SelectItem key={customer._id} value={customer._id}>
                {customer.customer_name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6 mt-6">
        {isPDFShow && (
          <CustomerReceiptPDF
            setOpen2={setOpen2}
            open2={open2}
            companyInfo={customerDetails}
            selectedProduct={selectedProduct}
            price={price}
            quality={quantity}
            discount={discount}
            receiveAmount={receiveAmount}
            sum={sum}
            payment_method={selected}
          />
        )}
        {!isPDFShow && (
          <div className="flex justify-between text-base font-medium text-gray-900">
            <div className="flex flex-col gap-3 items-end flex-grow">
              <div className="flex gap-4 items-center">
                <p>Total Amount</p>
                {isNaN(sum) || isNaN(discount) ? (
                  0
                ) : (
                  <p className="text-end">{sum - discount}</p>
                )}
              </div>

              <div className="flex gap-4 items-center">
                <p>Discount</p>
                <Input
                  size="sm"
                  className="w-24"
                  min={1}
                  value={discount}
                  onChange={(e) => handleDiscount(e)}
                  variant="bordered"
                  placeholder="Amount"
                  classNames={{
                    innerWrapper: "ml-3",
                  }}
                  type="number"
                  labelPlacement="outside"
                />
              </div>
              <div className="flex gap-4 items-center">
                <p>Received Amount</p>
                <Input
                  size="sm"
                  className="w-24"
                  min={1}
                  value={receiveAmount}
                  onChange={(e) => handleReceiveAmount(e)}
                  variant="bordered"
                  placeholder="Amount"
                  classNames={{
                    innerWrapper: "ml-3",
                  }}
                  type="number"
                  labelPlacement="outside"
                />
              </div>

              <RadioGroup
                value={selected}
                onValueChange={setSelected}
                label="Select Payment method"
                orientation="horizontal"
              >
                <Radio value="cash">Cash</Radio>
                <Radio value="bkash">Bkash</Radio>
              </RadioGroup>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4 justify-end">
          {!isPDFShow ? (
            <Button
              onClick={handleSubmit}
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={() => setIsPDFShow(false)}
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Cancel
            </Button>
          )}

          <div>
            <Button
              onClick={() => downloadPDF()}
              color="primary"
              variant="faded"
            >
              {!isPDFShow ? "View Receipt" : "Download Receipt"}
            </Button>
          </div>
        </div>
      </div>

      <ModalWrapper
        size="xl"
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title="Add New Customer"
        content={<AddCustomer onClose={onClose} setCustomers={setCustomers} />}
        onActionButton={() => onClose()}
      />
    </Fragment>
  );
}
