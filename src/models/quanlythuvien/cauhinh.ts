import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { useState } from 'react';

export default () => {
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<QuanLyThuVien.ICauHinhVaoRaThuVien>();
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);

	const handleEdit = (rec?: QuanLyThuVien.ICauHinhVaoRaThuVien) => {
		if (rec) setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec?: QuanLyThuVien.ICauHinhVaoRaThuVien) => {
		if (rec) setRecord(rec);
		setEdit(false);
		setIsView(true);
		setVisibleForm(true);
	};

	return {
		visibleForm,
		setVisibleForm,
		record,
		setRecord,
		edit,
		setEdit,
		handleEdit,
		isView,
		setIsView,
		handleView,
	};
};
