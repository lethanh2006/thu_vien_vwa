import MyDatePicker from '@/components/MyDatePicker';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import SelectHocKy from '@/pages/DaoTao/HocKy/SelectHocKy';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDotNhapSach = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title, getData } = props;
	const thoiGianBatDau: Date = Form.useWatch('thoiGianBatDau', form);
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'sachtailieu.anpham.dotnhapsach',
	);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id && recHocKy?._id) {
			form.setFieldsValue({
				maHocKy: recHocKy?.ma,
			});
		}
	}, [record?._id, recHocKy?._id, visibleForm]);

	const onFinish = async (values: AnPham.IDotNhapSach) => {
		values.maHocKy = recHocKy?.ma ?? '';
		values.maNamHoc = recHocKy?.namHoc?.ma ?? '';
		values.thoiGianBatDau = dayjs(values.thoiGianBatDau).startOf('day').toISOString();
		values.thoiGianKetThuc = dayjs(values.thoiGianKetThuc).endOf('day').toISOString();
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							name='maHocKy'
							label={intl.formatMessage({ id: 'sachtailieu.hocky.hocKy' })}
							rules={[...rules.required]}
						>
							<SelectHocKy selectMa />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.tenDot' })}
							name='ten'
							rules={[...rules.required, ...rules.text, ...rules.length(100)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.nhapTenDot' })} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.nguonBoSung' })}
							name='nguonBoSungId'
							rules={[...rules.required]}
						>
							<SelectNguonBoSung />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='thoiGianBatDau'
							label={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.thoiGianBatDau' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								onChange={(val) => {
									form.validateFields(['thoiGianKetThuc']);
								}}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='thoiGianKetThuc'
							label={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.thoiGianKetThuc' })}
							rules={[
								...rules.required,
								...rules.sauNgay(thoiGianBatDau, intl.formatMessage({ id: 'sachtailieu.dotnhapsach.thoiGianBatDau' })),
							]}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(thoiGianBatDau)} />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							name='soChungTu'
							label={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.soChungTu' })}
							rules={[...rules.text, ...rules.length(100)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.nhapSoChungTu' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='ngayChungTu' label={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.ngayChungTu' })}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.moTa' })} name='moTa'>
							<Input.TextArea rows={2} placeholder={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.nhapMoTa' })} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDotNhapSach;
