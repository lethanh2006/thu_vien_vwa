import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { Button, message, Modal } from 'antd';
import { useIntl, useModel } from 'umi';

const ModalTimKiem = (props: {
	visibleForm: boolean;
	setVisibleForm: (val: boolean) => void;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { visibleForm, setVisibleForm, getData } = props;

	const { page, limit, selectedIds, setSelectedIds } = useModel('sachtailieu.anpham.thongtinanpham');

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Nhan đề',
			dataIndex: 'nhanDe',
			width: 180,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 150,
		},
		// {
		// 	title: 'Đăng ký cá biệt',
		// 	align: 'center',
		// 	width: 90,
		// 	render: (val, rec) => rec?.thuocTinhAnPham?.find((item) => item?.code === '$j')?.value,
		// },
	];

	const handleTimKiem = () => {
		if (!selectedIds?.length) {
			message.error('Vui lòng chọn thông tin ấn phẩm cho mượn!');
			return;
		}
		setVisibleForm(false);
	};

	return (
		<Modal
			title='Thông tin ấn phẩm tìm kiếm'
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			width={800}
			footer={null}
		>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit]}
				modelName='sachtailieu.anpham.thongtinanpham'
				buttons={{ create: false }}
				hideCard
				otherProps={{
					rowKey: (rec: AnPham.IThongTinAnPham) => rec._id,
					rowSelection: {
						type: 'checkbox',
						selectedRowKeys: selectedIds,
						preserveSelectedRowKeys: true,
						onChange: (selectedRowKeys: string[]) => {
							setSelectedIds(selectedRowKeys.slice(-1));
						},
						columnWidth: 40,
						hideSelectAll: true,
					},
				}}
			/>

			<div className='form-footer'>
				<Button type='primary' onClick={handleTimKiem}>
					Xác nhận
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default ModalTimKiem;
