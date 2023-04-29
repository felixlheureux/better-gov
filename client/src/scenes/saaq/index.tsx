import api, { Outlet } from "@/features/api";
import { ActionIcon, Box, Button, Card, Flex, Select, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconX } from "@tabler/icons-react";
import { Map, Marker, Overlay } from "pigeon-maps";
import { osm } from "pigeon-maps/providers";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

const Saaq = () => {
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [search_params, setSearchParams] = useSearchParams({});
  const [card_ref, setCardRef] = useState<HTMLDivElement | null>(null!);

  const { data: categories } = useSWR(api.getCategories.key, api.getCategories.fetcher);
  const { data: outlets } = useSWR(api.getOutlets.key, api.getOutlets.fetcher);
  const { data: cities } = useSWR(api.getCities.key, api.getCities.fetcher);

  const form = useForm({
    initialValues: {
      category: search_params.get("category") || "",
      service: search_params.get("service") || "",
      option: search_params.get("option") || "",
    },
  });

  if (categories === undefined || outlets === undefined || cities === undefined) {
    return <div>Loading...</div>;
  }

  const category_uid = form.values.category;
  const service_uid = form.values.service;
  const option_uid = form.values.option;
  const category = categories?.find((c) => c.uid === parseInt(category_uid));
  const has_services = category?.services && category?.services.length > 0;
  const services = has_services
    ? category?.services.map((s) => ({
        label: s.title,
        value: s.uid.toString(),
      }))
    : [];
  const service = category?.services?.find((s) => s.uid === parseInt(service_uid));
  const has_options = service && service.options.length > 0;
  const options = has_options
    ? service.options.map((s) => ({
        label: s.title,
        value: s.uid.toString(),
      }))
    : [];

  const markers =
    outlets[`${category_uid}:${service_uid}:${option_uid}`] ||
    outlets[`${category_uid}:${service_uid}`] ||
    outlets[`${category_uid}`];

  return (
    <Box>
      <form>
        <Flex gap="sm" mb="sm">
          <Select
            label="Service category"
            placeholder="Select category..."
            data={categories.map((c) => ({
              label: c.name,
              value: c.uid.toString(),
            }))}
            {...form.getInputProps("category")}
          />
          {has_services && (
            <Select
              label="Service"
              placeholder="Select service..."
              data={services}
              {...form.getInputProps("service")}
            />
          )}
          {has_options && (
            <Select label="Service" placeholder="Select service..." data={options} {...form.getInputProps("service")} />
          )}
        </Flex>
      </form>
      <Map provider={osm} height={1200} defaultCenter={[47.43622, -72.77654]} defaultZoom={6}>
        {markers?.map((m) => (
          <Marker
            key={m.uid}
            hover={outlet ? (m.uid === outlet?.uid ? true : false) : undefined}
            width={24}
            color="#FF0000"
            anchor={[parseFloat(m.gps_latitude), parseFloat(m.gps_longitude)]}
            onClick={() => setOutlet(m)}
          />
        ))}
        {outlet !== null && (
          <Overlay
            anchor={[parseFloat(outlet.gps_latitude), parseFloat(outlet.gps_longitude)]}
            offset={[(card_ref?.offsetWidth || 0) / 2, (card_ref?.offsetHeight || -32) + 32 || 0]}>
            <Card ref={setCardRef} shadow="sm" pt={"xs"} px={"xs"} radius="md" withBorder w={248}>
              <Flex justify="flex-end">
                <ActionIcon size="sm" onClick={() => setOutlet(null)}>
                  <IconX size="0.875rem" />
                </ActionIcon>
              </Flex>
              <Text size="sm" color="dimmed">
                {cities.find((c) => c.uid === outlet?.city_uid)?.nom}
              </Text>
              <Text size="sm">{outlet.name}</Text>
              <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => window.open("https://saaq.gouv.qc.ca/en/find-service-outlet", "_blank")}>
                Make an appointment
              </Button>
            </Card>
          </Overlay>
        )}
      </Map>
    </Box>
  );
};

export default Saaq;
