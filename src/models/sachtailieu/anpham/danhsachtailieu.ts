import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { useState } from 'react';

export default () => {
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<AnPham.TDanhSachTaiLieuTrucTuyen>();
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

	const handleEdit = (rec?: AnPham.TDanhSachTaiLieuTrucTuyen) => {
		if (rec) setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec?: AnPham.TDanhSachTaiLieuTrucTuyen) => {
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
		formSubmiting,
		setFormSubmiting,
		isView,
		setIsView,
		handleView,
	};
};
