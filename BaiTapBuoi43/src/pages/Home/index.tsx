import { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router";
import api from "../../plugins/axios";

type CustomerItem = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  rank?: string;
};

type CustomerForm = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  rank: string;
};

const rankOptions = ["GOLD", "SILVER", "BRONZE"];

const emptyForm: CustomerForm = {
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  rank: "",
};

export default function Home() {
  const navigate = useNavigate();

  const [list, setList] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [formData, setFormData] = useState<CustomerForm>(emptyForm);

  const getErrorMessage = (error: unknown) => {
    if (error && typeof error === "object" && "message" in error) {
      return String((error as { message?: string }).message || "Có lỗi xảy ra");
    }
    return "Có lỗi xảy ra";
  };

  const getData = useCallback(async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await api.get("/customers");
      const data = res.data;
      const arr = Array.isArray(data)
        ? data
        : data?.data || data?.content || [];
      setList(arr);
    } catch (error) {
      setErrMsg(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEdit) {
        await api.put("/customers/" + formData.id, formData);
      } else {
        await api.post("/customers", formData);
      }
      setOpen(false);
      setFormData(emptyForm);
      await getData();
    } catch {
      setErrMsg("Có lỗi xảy ra khi lưu");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa không?")) return;

    try {
      await api.delete("/customers/" + id);
      await getData();
    } catch {
      setErrMsg("Lỗi khi xóa");
    }
  };

  const handleEdit = (item: CustomerItem) => {
    setIsEdit(true);
    setFormData({
      id: item.id || "",
      name: item.name || "",
      email: item.email || "",
      phone: item.phone || "",
      address: item.address || "",
      rank: item.rank || "",
    });
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData(emptyForm);
    setOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Quản lý khách hàng
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              Thêm mới
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Stack>
        </Box>

        {errMsg && <Alert severity="error">{errMsg}</Alert>}

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={60}>STT</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Rank</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>SĐT</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell width={180} align="center">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((item, index) => (
                    <TableRow key={item.id || index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.rank || ""}</TableCell>{" "}
                      <TableCell>{item.email || ""}</TableCell>
                      <TableCell>{item.phone || ""}</TableCell>
                      <TableCell>{item.address || ""}</TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleEdit(item)}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(item.id)}
                          >
                            Xóa
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEdit ? "Sửa khách hàng" : "Thêm khách hàng"}
        </DialogTitle>

        <Box component="form" onSubmit={handleSave}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="Họ tên"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />

              <Autocomplete
                options={rankOptions}
                value={formData.rank}
                onChange={(_, value) =>
                  setFormData((prev) => ({ ...prev, rank: value || "" }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Rank" fullWidth />
                )}
              />

              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="SĐT"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained" disabled={isSaving}>
              Lưu
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}
