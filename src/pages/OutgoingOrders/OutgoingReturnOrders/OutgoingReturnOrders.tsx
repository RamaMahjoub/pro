import { NavLink } from "react-router-dom";
import { routes } from "../../../router/constant";
import { Filter } from "../../ReceivedOrders/PurchaseOrders";
import Button from "../../../components/Button/Button";
import { useEffect, useMemo, useState } from "react";
import CustomPagination from "../../../components/CustomPagination/CustomPagination";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import NoData from "../../NoData/NoData";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import { SendedReturnOrders } from "../../../Schema/tables/SendedReturnOrders";
import TextBadge, { BadgeStatus } from "../../../components/Badge/TextBadge";
import { getMonth } from "../../../utils/Month";
import Beat from "../../../components/Loading/Beat";
import { usePagination } from "../../../hooks/usePagination";
import { ResponseStatus } from "../../../enums/ResponseStatus";
import Menu, { MenuItem, SubMenu } from "../../../components/Menu/Menu";
import { SubMenuProvider } from "../../../components/Menu/context";
import { FunnelFill } from "react-bootstrap-icons";
import IconButton from "../../../components/Button/IconButton";
import { useOpenToggle } from "../../../hooks/useOpenToggle";
import { useMediaQuery } from "react-responsive";
import {
  findAllSendedReturnMedicines,
  selectAllSendedReturnMedicinesData,
  selectAllSendedReturnMedicinesStatus,
} from "../../../redux/orderSlice";
import { SendedReturnOrder } from "../../../Schema/Responses/SendedOrder";

const filterList: Array<Filter> = [
  { name: "طلبات الشراء", route: `/${routes.OUTGOING_ORDERS}` },
  { name: "طلبات الإرجاع", route: `/${routes.OUTGOING_RETURN_ORDERS}` },
];

const OutgoingReturnOrders = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const { open, handleOpen } = useOpenToggle();
  const [filtered] = useState<string>(filterList[1].name);
  const { pageIndex, pageSize, pagination, handlePgination } =
    usePagination(10);

  const dispatch = useAppDispatch();
  const data = useAppSelector(selectAllSendedReturnMedicinesData);
  let content = <NoData />;
  const status = useAppSelector(selectAllSendedReturnMedicinesStatus);
  const columns = useMemo<ColumnDef<SendedReturnOrders>[]>(
    () => [
      {
        header: "رقم الطلب",
        cell: (row) => row.renderValue(),
        accessorKey: "id",
      },
      {
        header: "تاريخ الطلب",
        cell: (row) => row.renderValue(),
        accessorKey: "returnOrderDate",
      },
      {
        header: "الجهة المستلمة",
        cell: (row) => row.renderValue(),
        accessorKey: "supplierName",
      },
      {
        header: "الحالة",
        cell: (row) => row.renderValue(),
        accessorKey: "status",
      },
      {
        header: "الكلفة",
        cell: (row) => row.renderValue(),
        accessorKey: "totalPrice",
      },
    ],
    []
  );
  console.log(data);
  useEffect(() => {
    dispatch(
      findAllSendedReturnMedicines({
        limit: String(pageSize),
        page: String(pageIndex),
      })
    );
  }, [dispatch, pageIndex, pageSize]);
  const transformedData = useMemo(() => {
    return status === ResponseStatus.SUCCEEDED && data.data.length > 0
      ? data.data.map((order: SendedReturnOrder) => {
          const state =
            order.status === "Pending" ? (
              <TextBadge title={"معلّق"} status={BadgeStatus.WARNING} />
            ) : order.status === "Accepted" ? (
              <TextBadge title={"تم القبول"} status={BadgeStatus.SUCCESS} />
            ) : (
              <TextBadge title={"مرفوض"} status={BadgeStatus.DANGER} />
            );
          const date = new Date(order.returnOrderDate);
          return {
            id: `#${order.id}`,
            returnOrderDate: `${getMonth(
              date.getMonth() + 1
            )} ${date.getFullYear()}، ${date.getDate()} `,
            status: state,
            supplierName: order.supplierName,
            totalPrice: `${order.totalPrice} ل.س`,
          };
        })
      : [];
  }, [data.data, status]);

  const table = useReactTable({
    data: transformedData,
    columns,
    pageCount: data.totalRecords,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });
  if (status === ResponseStatus.LOADING) {
    content = <Beat />;
  } else if (status === ResponseStatus.IDLE) {
    content = <NoData />;
  } else if (status === ResponseStatus.FAILED) {
    content = <div>error...</div>;
  }
  return (
    <>
      <div className="overflow-auto mid scrollbar-none p-large">
        <div className="mid">
          {filterList.map((filter) => (
            <NavLink to={filter.route} key={filter.name}>
              <Button
                variant={`${filtered === filter.name ? "active-text" : "text"}`}
                disabled={false}
                text={filter.name}
                size="med"
                className="min-w-max"
              />
            </NavLink>
          ))}
          <div>
            {isMobile ? (
              <IconButton
                color="light-grey"
                icon={<FunnelFill fontSize="small" />}
                onClick={handleOpen}
              />
            ) : (
              <Button
                variant="light-grey"
                disabled={false}
                text="تصنيف"
                start={true}
                icon={<FunnelFill fontSize="small" />}
                size="med"
                onClick={handleOpen}
              />
            )}

            <Menu divide={true} open={open}>
              <SubMenuProvider>
                <SubMenu title="الحالة">
                  <MenuItem content="مرفوض" />
                  <MenuItem content="مُعلق" />
                  <MenuItem content="تم القبول" />
                </SubMenu>
              </SubMenuProvider>
            </Menu>
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-auto bg-greyScale-lighter gap-large p-large scrollbar-thin">
        <div className="flex flex-col w-full h-full bg-white p-large max-h-fit rounded-small">
          <div className="flex-1 overflow-auto bg-white scrollbar-thin scrollbar-track-white scrollbar-thumb-greyScale-lighter">
            <table className="w-full min-w-max">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    className="sticky top-0 bg-greyScale-lighter"
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          className="py-medium px-small text-center min-w-[150px] text-medium text-greyScale-light first:rounded-tr-med first:rounded-br-med last:rounded-tl-med last:rounded-bl-med"
                          key={header.id}
                          colSpan={header.colSpan}
                        >
                          {header.isPlaceholder ? null : (
                            <div>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => {
                    return (
                      <tr
                        className="transition-colors duration-300 ease-in border-b border-opacity-50 cursor-pointer border-greyScale-light hover:bg-greyScale-lighter"
                        key={row.id}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              className="py-medium px-small text-center min-w-[150px] max-w-[150px] font-semibold text-medium text-greyScale-main overflow-hidden text-ellipsis whitespace-nowrap"
                              key={cell.id}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={columns.length}>{content}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <CustomPagination
            count={table.getPageCount()}
            page={pageIndex + 1}
            onChange={handlePgination}
            pageSize={pageSize}
          />
        </div>
      </div>
    </>
  );
};

export default OutgoingReturnOrders;
