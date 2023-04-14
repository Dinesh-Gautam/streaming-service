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
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

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
    const data = await fetch(
      "/api/admin/user?ids=" + selected.join(",") + "&o=" + "delete"
    ).then((e) => e.json());

    if (!data.success) {
      alert(data.errMessage || "some error occurred");
      return;
    }

    setUsers((prev) => prev.filter((user) => !selected.includes(user.id)));
    setSelected([]);
  }

  async function editUser() {
    const { name, role } = editValue;

    const data = await fetch(
      "/api/admin/user?ids=" + selected.join(",") + "&o=" + "edit",
      {
        method: "POST",
        body: JSON.stringify({
          newName: name || null,
          newRole: role || null,
        }),
      }
    ).then((e) => e.json());
    if (!data.success) {
      alert(data.errMessage);
      return;
    }
    console.log(data.message);
    setUsers(data.data);
    setOpen(false);
    setSelected([]);
  }

  const onEditValueChange = (type, value) => {
    setEditValues((prev) => ({ ...prev, [type]: value }));
  };

  function isEditButtonsDisabled() {
    return selected.length < 1;
  }
  return (
    <React.Fragment>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-end",
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
                <Input
                  onChange={(e) => onEditValueChange("name", e.target.value)}
                  value={editValue.name}
                  type="text"
                ></Input>
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  onChange={(e, value) => onEditValueChange("role", value)}
                  value={editValue.role}
                  slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                >
                  <Option value="admin">Admin</Option>
                  <Option value="user">User</Option>
                </Select>
              </FormControl>
              <Button
                color="primary"
                onClick={() => {
                  setOpen(false);
                  editUser();
                }}
              >
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>

        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          <Typography>Total Users:</Typography>
          <Typography sx={{ opacity: 0.5 }}>{users.length}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            disabled={isEditButtonsDisabled()}
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => setOpen(true)}
            startDecorator={<i data-feather="edit-2" />}
          >
            Edit
          </Button>
          <Button
            disabled={isEditButtonsDisabled()}
            size="sm"
            variant="outlined"
            color="danger"
            startDecorator={<i data-feather="user-x" />}
            onClick={() => deleteUser()}
          >
            Delete
          </Button>
        </Box>
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

              <th style={{ width: 120, padding: 12 }}>Date</th>
              <th style={{ width: 220, padding: 12 }}>User</th>
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

                <td>
                  {new Date(user.creationDate).toLocaleDateString("en-IN")}
                </td>

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
    </React.Fragment>
  );
}
