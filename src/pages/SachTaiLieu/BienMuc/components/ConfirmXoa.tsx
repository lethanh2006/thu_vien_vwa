import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Alert, Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ConfirmXoaAnPham = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	getData: () => void;
	onShowCopies?: (record: AnPham.IRecord) => void;
}) => {
	const { visible, setVisible, getData, onShowCopies } = props;
	const { record, deleteModel } = useModel('sachtailieu.anpham.anpham');
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();
	const [conflict, setConflict] = useState(false);

	useEffect(() => {
		setErrorMessage(undefined);
		setConflict(false);
	}, [visible, record?._id]);

	const handleDelete = async () => {
		if (!record?._id || submitting) return;
		setSubmitting(true);
		setErrorMessage(undefined);
		try {
			await deleteModel(record._id, () => {});
			getData();
			setVisible(false);
		} catch (error: any) {
			setErrorMessage(error?.response?.data?.message ?? 'Không thể xóa ấn phẩm. Vui lòng tải lại dữ liệu.');
			setConflict(error?.response?.status === 409);
			if (error?.response?.status === 404) getData();
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal
			open={visible}
			onCancel={() => !submitting && setVisible(false)}
			width={600}
			footer={null}
			title='Xác nhận xóa ấn phẩm'
			maskClosable={false}
		>
			<div style={{ textAlign: 'center', marginBottom: 24 }}>
				<ExclamationCircleFilled style={{ color: 'orange', fontSize: 48 }} />
				<p>Bạn có chắc chắn muốn xóa ấn phẩm “{record?.nhanDe ?? record?.nhanDeConverse}”?</p>
				<p>Chỉ xóa được khi đã xử lý hết các dòng xếp giá, bản ĐKCB và dữ liệu mượn trả liên quan.</p>
			</div>
			{errorMessage && (
				<Alert
					type='error'
					showIcon
					message={errorMessage}
					style={{ marginBottom: 16 }}
					action={
						conflict && onShowCopies && record ? (
							<Button onClick={() => onShowCopies(record)}>Xem ĐKCB / thanh lý</Button>
						) : undefined
					}
				/>
			)}
			<div className='form-footer'>
				<Button loading={submitting} onClick={handleDelete} type='primary' danger>
					Xóa ấn phẩm
				</Button>
				<Button disabled={submitting} onClick={() => setVisible(false)}>
					Hủy
				</Button>
			</div>
		</Modal>
	);
};

export default ConfirmXoaAnPham;
