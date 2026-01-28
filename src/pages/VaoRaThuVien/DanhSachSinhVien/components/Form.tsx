import MyDatePicker from '@/components/MyDatePicker';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormVaoRaThuVien = (props: any) => {
	const intl = useIntl();
	const { title, getData } = props;
	const [form] = Form.useForm();
	const { formSubmiting, record, setVisibleForm, edit, visibleForm, postRaVaoThuVienModel } =
		useModel('quanlythuvien.vaorathuvien');
	const { danhSach: danhSachSinhVien } = useModel('sinhvien.sinhvien');
	const [inputDate, setInputDate] = useState<any>();
	const [outputDate, setOutputDate] = useState<any>();

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm]);

	const disabledDateStart = (current: any) => {
		return current && current.isAfter(dayjs(outputDate)) && outputDate;
	};
	const disabledDateEnd = (current: any) => {
		return current && current.isBefore(dayjs(inputDate)) && inputDate;
	};

	const onFinish = async (values: any) => {
		postRaVaoThuVienModel(values, getData)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={24}>
						<Form.Item
							name='maSinhVien'
							label={intl.formatMessage({ id: 'vaorathuvien.label.sinhVien' })}
							rules={[...rules.required]}
						>
							<SelectSinhVienDebounce
								selectMa
								onChange={(val) => {
									const ns = danhSachSinhVien?.find((item) => item?.ma === val);
									form.setFieldsValue({ hoTen: ns?.ten });
								}}
							/>
						</Form.Item>
						<Form.Item name='hoTen' hidden />
					</Col>
					<Col xs={24} md={24}>
						<Form.Item
							name='thoiGianVao'
							label={intl.formatMessage({ id: 'vaorathuvien.label.thoiGianVao' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								format='DD/MM/YYYY HH:mm'
								showTime={{ minuteStep: 1 }}
								onChange={(value) => {
									setInputDate(value);
								}}
								disabledDate={disabledDateStart}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='thoiGianRa' label={intl.formatMessage({ id: 'vaorathuvien.label.thoiGianRa' })}>
							<MyDatePicker
								format='DD/MM/YYYY HH:mm'
								showTime={{ minuteStep: 1 }}
								onChange={(value) => {
									setOutputDate(value);
								}}
								disabledDate={disabledDateEnd}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{edit
							? intl.formatMessage({ id: 'global.button.luulai' })
							: intl.formatMessage({ id: 'global.button.themmoi' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormVaoRaThuVien;
