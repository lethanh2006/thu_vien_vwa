import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Form, type FormInstance, Input, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectMayChu from './Select';

const { Option } = Select;

const Z3950Page = (props: { visible: boolean; setVisible: (val: boolean) => void; form: FormInstance }) => {
	const [form] = Form.useForm();
	const { visible, setVisible, form: formExternal } = props;
	const { dsMayChuZ3950, timKiemZ3950Model, dsAnPhamZ3950, setDSAnPhamZ3950, loading } =
		useModel('sachtailieu.anpham.anpham');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
			setDSAnPhamZ3950([]);
		} else {
			form.setFieldsValue({
				field: 'any',
			});
		}
	}, [visible]);

	const onFinish = async (values: any) => {
		const mayChu = dsMayChuZ3950?.find((item) => item?.port === values.mayChu);

		timKiemZ3950Model(values.query, mayChu?.host ?? '', mayChu?.port ?? 0, mayChu?.database ?? '', values.field)
			.then()
			.catch((er) => console.log(er));
	};

	const columns: IColumn<Z3950.IRecord>[] = [
		{
			title: 'Tác giả',
			dataIndex: 'author',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Nhan đề',
			dataIndex: 'title',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Mã ISBN',
			dataIndex: 'isbn',
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Mã ISSN',
			dataIndex: 'issn',
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Nhà xuất bản',
			dataIndex: 'publisher',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Năm xuất bản',
			dataIndex: 'year',
			align: 'center',
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					onClick={() => {
						formExternal.setFieldsValue({
							tacGia: rec?.author,
							nhanDe: rec?.title,
							ISBN: rec?.isbn,
							ISSN: rec?.issn,
							namXuatBan: rec?.publisher,
							nhaXuatBan: rec?.year,
						});
						setVisible(false);
					}}
					tooltip='Xác nhận'
					className='text-success'
					type='link'
					icon={<CheckOutlined />}
				/>
			),
		},
	];

	return (
		<Modal title='Tải về qua Z39.50' visible={visible} onCancel={() => setVisible(false)} footer={null} width={900}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name='mayChu' label='Máy chủ' rules={[...rules.required]}>
							<SelectMayChu />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Từ khóa' required>
							<Input.Group compact>
								<Form.Item name='field' noStyle>
									<Select style={{ width: '20%' }}>
										<Option value='any'>Tất cả</Option>
										<Option value='title'>Nhan đề</Option>
										<Option value='author'>Tác giả</Option>
										<Option value='subject'>Chủ đề</Option>
										<Option value='isbn'>Mã ISBN</Option>
										<Option value='issn'>Mã ISSN</Option>
										<Option value='publisher'>Nhà xuất bản</Option>
										<Option value='date'>Ngày xuất bản</Option>
									</Select>
								</Form.Item>
								<Form.Item name='query' noStyle rules={[...rules.required]}>
									<Input style={{ width: '80%' }} placeholder='Nhập từ khóa' />
								</Form.Item>
							</Input.Group>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						Tìm kiếm
					</Button>
				</div>

				<div className='fw500'>Danh sách tìm kiếm</div>
				{dsAnPhamZ3950?.length ? (
					<TableStaticData
						columns={columns}
						data={dsAnPhamZ3950 ?? []}
						loading={loading}
						size='small'
						otherProps={{ pagination: true }}
						hasTotal
						addStt
					/>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu!' />
				)}
			</Form>
		</Modal>
	);
};

export default Z3950Page;
