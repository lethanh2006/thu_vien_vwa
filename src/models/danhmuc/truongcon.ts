import { useState } from 'react';

export default () => {
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<TruongBienMuc.TDanhSachTruongCon>();
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

	const handleEdit = (rec?: TruongBienMuc.TDanhSachTruongCon) => {
		if (rec) setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec?: TruongBienMuc.TDanhSachTruongCon) => {
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
