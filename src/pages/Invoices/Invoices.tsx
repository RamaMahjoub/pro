import { useLocation } from "react-router-dom";
import { HeaderTitle } from "../../utils/HeaderTitle";
import Header, { HeaderTypes } from "../../components/Header/Header";
import { data } from "../../Schema/response/invoicesSchema";
import { getMonth } from "../../utils/Month";
import { AccordionProvider } from "../../components/Accordion/context";
import Accordion from "../../components/Accordion/Accordion";
import AccordionTitle from "../../components/Accordion/AccordionTitle";
import AccordionContent from "../../components/Accordion/AccordionContent";

const Invoices = () => {
  const { pathname } = useLocation();
  const title = HeaderTitle(pathname);
  return (
    <div className="flex flex-col h-screen">
      <Header title={title!} leftSpace={HeaderTypes.FREE} />
      <div className="flex flex-col flex-1 overflow-auto gap-large bg-greyScale-lighter scrollbar-thin scrollbar-track-white scrollbar-thumb-greyScale-lighter p-large ">
        {data.map((invoice) => {
          return (
            <AccordionProvider>
              <Accordion>
                {/* header */}
                <AccordionTitle>
                  <span className="flex items-center justify-between flex-1">
                    <p className="text-x-large text-greyScale-main">
                      {invoice.from}
                    </p>
                  </span>
                </AccordionTitle>

                <AccordionContent>
                  {/* content */}
                  <div className="flex flex-col text-large text-greyScale-light gap-medium">
                    {invoice.bills.map((bill) => {
                      const invoiceDate = `${getMonth(
                        bill.payDate.getMonth() + 1
                      )} ${bill.payDate.getFullYear()}، ${bill.payDate.getDate()} `;
                      return (
                        <span className="flex items-center justify-between border py-small px-medium rounded-med">
                          <p>{`${bill.payment} ل.س`}</p>
                          <p>{invoiceDate}</p>
                        </span>
                      );
                    })}
                  </div>
                </AccordionContent>
              </Accordion>
            </AccordionProvider>
          );
        })}
      </div>
    </div>
  );
};

export default Invoices;
