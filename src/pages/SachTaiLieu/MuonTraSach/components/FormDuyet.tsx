import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { inputFormat } from '@/utils/utils';
import { Col, Form, type FormInstance, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDuyet = (props: { form: FormInstance }) => {
	const { form } = props;
	const { record: recMuonTra, settingMuonTra } = useModel('sachtailieu.muontra.muontra');
	const { getModel, page, limit, selectedIds, setSelectedIds } = useModel('sachtailieu.anpham.anpham');
	const expired: Date = Form.useWatch('expired', form);

	const intl = useIntl();

	useEffect(() => {
		form.setFieldsValue({
			thoiGianMuon: dayjs(recMuonTra?.thoiGianMuonDuKien).toISOString(),
			expired: dayjs(recMuonTra?.thoiGianTraDuKien).toISOString(),
		});
	}, [, recMuonTra?._id, settingMuonTra?._id]);

	const getData = () => {
		if (recMuonTra?.anPhamId)
			getModel(undefined, undefined, undefined, undefined, undefined, `${recMuonTra?.anPhamId}/kha-dung`, {
				thoiGianBatDau: dayjs(recMuonTra?.thoiGianDangKy).toISOString(),
				thoiGianKetThuc: dayjs(expired).toISOString(),
			});
	};

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' }),
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' }),
			width: 150,
			render: (val, rec) => rec?.anPham?.tacGia,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dkcb.soDangKyCaBiet' }),
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 90,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.thoiGianXepGia' }),
			dataIndex: 'thoiGianXepGia',
			align: 'center',
			width: 130,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.donGia' }),
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(rec?.thongTinXepGia?.donGia ?? 0)} VNĐ`,
		},
	];

	return (
		<Row gutter={[12, 0]}>
			<Col xs={24}>
				<TableBase
					getData={getData}
					columns={columns}
					dependencies={[page, limit, recMuonTra?.anPhamId, expired]}
					modelName='sachtailieu.anpham.anpham'
					buttons={{ create: false }}
					hideCard
					otherProps={{
						rowKey: (rec: AnPham.IThongTinAnPham) => rec._id ?? '',
						rowSelection: {
							type: 'checkbox',
							selectedRowKeys: selectedIds,
							preserveSelectedRowKeys: true,
							onChange: (selectedRowKeys: any[]) => {
								setSelectedIds(selectedRowKeys.slice(-1));
							},
							columnWidth: 40,
							hideSelectAll: true,
						},
					}}
				/>
			</Col>
			<Col xs={24} md={12}>
				<Form.Item
					name='thoiGianMuon'
					label={intl.formatMessage({ id: 'sachtailieu.dkcb.thoiGianMuon' })}
					rules={[...rules.required]}
				>
					<MyDatePicker format='DD/MM/YYYY HH:mm' showTime={{ minuteStep: 5 }} />
				</Form.Item>
			</Col>
			<Col xs={24} md={12}>
				<Form.Item
					name='expired'
					label={intl.formatMessage({ id: 'sachtailieu.dkcb.hanTra' })}
					rules={[...rules.required]}
				>
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
