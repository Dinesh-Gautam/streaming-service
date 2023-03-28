/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

const rows = [
  {
    id: "INV-1234",
    date: "Feb 3, 2023",
    status: "Paid",
    customer: {
      initial: "O",
      name: "Olivia Ryhe",
      email: "olivia@email.com",
    },
    subscription: "Yearly",
  },
  {
    id: "INV-1233",
    date: "Feb 3, 2023",
    status: "Paid",
    customer: {
      initial: "S",
      name: "Steve Hampton",
      email: "steve.hamp@email.com",
    },
    subscription: "Monthly",
  },
  {
    id: "INV-1232",
    date: "Feb 3, 2023",
    status: "Paid",
    customer: {
      initial: "C",
      name: "Ciaran Murray",
      email: "ciaran.murray@email.com",
    },
    subscription: "Yearly",
  },
  {
    id: "INV-1231",
    date: "Feb 3, 2023",
    status: "Refunded",
    customer: {
      initial: "M",
      name: "Maria Macdonald",
      email: "maria.mc@email.com",
    },
    subscription: "Yearly",
  },
  {
    id: "INV-1230",
    date: "Feb 3, 2023",
    status: "Paid",
    customer: {
      initial: "C",
      name: "Charles Fulton",
      email: "fulton@email.com",
    },
    subscription: "Yearly",
  },
  {
    id: "INV-1229",
    date: "Feb 3, 2023",
    status: "Cancelled",
    customer: {
      initial: "J",
      name: "Jay Hooper",
      email: "hooper@email.com",
    },
    subscription: "Yearly",
  },
  {
    id: "INV-1228",
    date: "Feb 3, 2023",
    status: "Cancelled",
    customer: {
      initial: "K",
      name: "Krystal Stevens",
      email: "k.stevens@email.com",
    },
    subscription: "Monthly",
  },
  {
    id: "INV-1227",
    date: "Feb 3, 2023",
    status: "Paid",
    customer: {
      initial: "S",
      name: "Sachin Flynn",
      email: "s.flyn@email.com",
    },
    subscription: "Monthly",
  },
  {
    id: "INV-1226",
    date: "Feb 3, 2023",
    status: "Cancelled",
    customer: {
      initial: "B",
      name: "Bradley Rosales",
      email: "brad123@email.com",
    },
    subscription: "Monthly",
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function UsersTable({ userData }) {
  const [order, setOrder] = React.useState("desc");
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState(userData || []);
  const [editValue, setEditValues] = React.useState({ name: "", role: "" });

  React.useEffect(() => {
    if (open && selected.length === 1) {
      const { name, role } = users.find((e) => e.id == selected[0]);
      setEditValues((prev) => ({ ...prev, name, role }));
    } else {
      setEditValues({ name: "", role: "" });
    }
  }, [open]);

  async function deleteUser() {
    async function del(id) {
      const data = await fetch(
        "/api/admin/user?id=" + id + "&o=" + "delete"
      ).then((e) => e.json());

      if (!data.success) {
        alert(data.errMessage || "some error occurred");
      } else {
        console.log(data.message);
      }
    }

    selected.forEach(async (id) => {
      await del(id);
    });
    setUsers((user) => !selected.some((e) => e.id === user.id));
    setSelected([]);
  }

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
        >
          <Option value="paid">Paid</Option>
          <Option value="pending">Pending</Option>
          <Option value="refunded">Refunded</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Category</FormLabel>
        <Select placeholder="All">
          <Option value="all">All</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Customer</FormLabel>
        <Select placeholder="All">
          <Option value="all">All</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      {/* <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<i data-feather="search" />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <span>filter</span>
          <i data-feather="filter" />
        </IconButton>
      
      </Sheet> */}

      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          justifyContent: "flex-end",
          borderRadius: "sm",
          // py: 2,
          pb: 2,
          display: {
            xs: "none",
            sm: "flex",
          },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: {
              xs: "120px",
              md: "160px",
            },
          },
        }}
      >
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="edit-modal">
            <ModalClose />
            <Typography id="edit-modal" level="h2">
              Edit
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={editValue.name} type="text">
                  {" "}
                </Input>
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  value={editValue.role}
                  slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                >
                  <Option value="admin">Admin</Option>
                  <Option value="user">User</Option>
                </Select>
              </FormControl>
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
          startDecorator={<i data-feather="edit-2" />}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outlined"
          color="danger"
          startDecorator={<i data-feather="user-x" />}
          onClick={() => deleteUser()}
        >
          Delete
        </Button>
        {/* <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for order</FormLabel>
          <Input
            placeholder="Search"
            startDecorator={<i data-feather="search" />}
          />
        </FormControl>

        {renderFilters()} */}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "md",
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": (theme) =>
              theme.vars.palette.background.level1,
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": (theme) =>
              theme.vars.palette.background.level1,
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: "center", padding: 12 }}>
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length !== users.length
                  }
                  checked={selected.length === users.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? users.map((u) => u.id) : []
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === users.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              {/* <th style={{ width: 140, padding: 12 }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  fontWeight="lg"
                  endDecorator={<i data-feather="arrow-down" />}
                  sx={{
                    "& svg": {
                      transition: "0.2s",
                      transform:
                        order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                    },
                  }}
                >
                  Invoice
                </Link>
              </th> */}
              <th style={{ width: 120, padding: 12 }}>Date</th>
              <th style={{ width: 220, padding: 12 }}>User</th>
              {/* <th style={{ width: 120, padding: 12 }}>Status</th> */}
              <th style={{ width: 120, padding: 12 }}>Role</th>
              <th style={{ width: 160, padding: 12 }}> Subscription </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(users, getComparator(order, "name")).map((user) => (
              <tr key={user.id}>
                <td style={{ textAlign: "center" }}>
                  <Checkbox
                    checked={selected.includes(user.id)}
                    color={selected.includes(user.id) ? "primary" : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(user.id)
                          : ids.filter((itemId) => itemId !== user.id)
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                    sx={{ verticalAlign: "text-bottom" }}
                  />
                </td>
                {/* <td>
                  <Typography fontWeight="md">{row.id}</Typography>
                </td> */}
                <td>
                  {new Date(user.creationDate).toLocaleDateString("en-IN")}
                </td>
                {/* <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      {
                        Paid: <i data-feather="check" />,
                        Refunded: <i data-feather="corner-up-left" />,
                        Cancelled: <i data-feather="x" />,
                      }[row.status]
                    }
                    color={
                      {
                        Paid: "success",
                        Refunded: "neutral",
                        Cancelled: "danger",
                      }[row.status]
                    }
                  >
                    {row.status}
                  </Chip>
                </td> */}
                <td>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar size="sm">{user.name[0].toUpperCase()}</Avatar>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        fontWeight="lg"
                        level="body3"
                        textColor="text.primary"
                      >
                        {user.name}
                      </Typography>
                      <Typography level="body3">{user.email}</Typography>
                    </Box>
                  </Box>
                </td>
                <td>{user.role}</td>

                <td>None</td>
                {/* <td>
                  <Link fontWeight="lg" component="button" color="neutral">
                    Archive
                  </Link>
                  <Link
                    fontWeight="lg"
                    component="button"
                    color="primary"
                    sx={{ ml: 2 }}
                  >
                    Download
                  </Link>
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-mobile"
        sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <i data-feather="arrow-left" />
        </IconButton>
        <Typography level="body2" mx="auto">
          Page 1 of 10
        </Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <i data-feather="arrow-right" />
        </IconButton>
      </Box>
      {/* <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 4,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button
          size="sm"
          variant="plain"
          color="neutral"
          startDecorator={<i data-feather="arrow-left" />}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {["1", "2", "3", "…", "8", "9", "10"].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? "outlined" : "plain"}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="plain"
          color="neutral"
          endDecorator={<i data-feather="arrow-right" />}
        >
          Next
        </Button>
      </Box> */}
    </React.Fragment>
  );
}
