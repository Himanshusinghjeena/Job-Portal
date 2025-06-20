import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Delete, DeleteIcon, Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";

// Default logo when someone not uploaded the company logo
const DEFAULT_LOGO = "https://github.com/shadcn.png";

const CompaniesTable = () => {
  const navigate = useNavigate();
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const [filterCompanies, setFilterCompanies] = useState([]);

  useEffect(() => {
    const filteredCompanies = (companies || []).filter((company) => {
      if (!searchCompanyByText) return true;
      return company.name
        .toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompanies(filteredCompanies);
  }, [companies, searchCompanyByText]);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableCaption className="sr-only">A List of Your recent Registered Companies</TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow className="bg-gray-100/50">
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">Logo</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {filterCompanies.length <= 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No companies registered yet. Start by adding a new company!
                </TableCell>
              </TableRow>
            ) : (
              filterCompanies.map((company) => (
                <TableRow className="hover:bg-gray-50 transition-colors duration-150" key={company._id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          company.logo && company.logo !== ""
                            ? company.logo
                            : DEFAULT_LOGO
                        }
                        alt={company.name}
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.createdAt?.split("T")[0]}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Popover>
                      <PopoverTrigger className="outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
                        <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={5} className="z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden py-1 w-32">
                        <div
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </div>
                        {/* Delete functionality can be added here if needed */}
                        {/* <div onClick={() => { /* Implement delete logic * / }} className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150">
                          <MdDeleteForever className="h-4 w-4" />
                          <span>Delete</span>
                        </div> */}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompaniesTable;
