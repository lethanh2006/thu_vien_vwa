import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import rules from '@/utils/rules';
import { Col, Form, type FormInstance, Input, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDuyet = (props: { form: FormInstance }) => {
	const { form } = props;
	const { record: recAnPham, settingMuonTra } = useModel('sachtailieu.muontra.muontra');
	const { getModel, page, limit, selectedIds, setSelectedIds } = useModel('sachtailieu.anpham.thongtinanpham');
	const expired: Date = Form.useWatch('expired', form);

	useEffect(() => {
		form.setFieldsValue({
			expired: moment(recAnPham?.thoiGianDangKy).add(settingMuonTra?.thoiHanMuonTraSach || 150, 'days'),
		});
	}, [, recAnPham?._id, settingMuonTra?._id]);

	const getData = () => {
		if (recAnPham?.anPhamId)
			getModel(undefined, undefined, undefined, undefined, undefined, `an-pham/${recAnPham?.anPhamId}/kha-dung`, {
				thoiGianBatDau: moment(recAnPham?.thoiGianDangKy).toISOString(),
				thoiGianKetThuc: moment(expired).toISOString(),
			});
	};

	const columns: IColumn<AnPham.IThongTinAnPham>[] = [
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => rec?.anPham?.tacGia,
		},
		{
			title: 'Đăng ký cá biệt',
			align: 'center',
			width: 90,
			render: (val, rec) => rec?.thuocTinhAnPham?.find((item) => item?.code === '$j')?.value,
		},
	];

	return (
		<Row gutter={[12, 0]}>
			<Col xs={24}>
				<TableBase
					getData={getData}
					columns={columns}
					dependencies={[page, limit, recAnPham?.anPhamId, expired]}
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
			</Col>
			<Col xs={24} md={12}>
				<Form.Item name='expired' label='Hạn trả' rules={[...rules.required]}>
					<MyDatePicker format='DD/MM/YYYY HH:mm' showTime={{ minuteStep: 5 }} />
				</Form.Item>
			</Col>
			<Col xs={24}>
				<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
					<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormDuyet;
