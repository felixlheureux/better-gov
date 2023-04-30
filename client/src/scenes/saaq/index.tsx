import api, { Outlet } from "@/features/api";
import { Box, Button, Card, CloseButton, Drawer, Flex, Loader, LoadingOverlay, Select, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Map, Marker, Overlay, ZoomControl } from "pigeon-maps";
import { osm } from "pigeon-maps/providers";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

const errors_to_message = {
  WITHOUT_APPOINTMENT: "Without appointment",
  TEMPORARILY_CLOSED: "Temporarily closed",
  INDEFINITLY_CLOSED: "Indefinitly closed",
  APPPOINTMENT_BY_PHONE: "Appointment by phone",
};

const Saaq = () => {
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [search_params, setSearchParams] = useSearchParams({});
  const [card_ref, setCardRef] = useState<HTMLDivElement | null>(null!);
  const [opened, { open, close }] = useDisclosure(false);
  const [calendar_loading, setCalendarLoading] = useState(false);

  const { data: categories } = useSWR(api.getCategories.key, api.getCategories.fetcher);
  const { data: outlets } = useSWR(api.getOutlets.key, api.getOutlets.fetcher);
  const { data: cities } = useSWR(api.getCities.key, api.getCities.fetcher);

  if (categories === undefined || outlets === undefined || cities === undefined) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
        }}>
        <Loader />
      </div>
    );
  }

  const category_uid = search_params.get("category") || "";
  const service_uid = search_params.get("service") || "";
  const option_uid = search_params.get("option") || "";
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
    <Box styles={{ position: "relative", overflow: "hidden" }}>
      <Box
        p="xs"
        pt={0}
        sx={(theme) => ({
          position: "absolute",
          zIndex: 1,
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          borderRadius: `0 0 ${theme.radius.md} 0`,
        })}>
        <Flex gap="sm">
          <Select
            label="Service category"
            placeholder="Select category..."
            name="category"
            value={search_params.get("category")}
            onChange={(v) => setSearchParams(v ? { category: v } : undefined)}
            data={categories.map((c) => ({
              label: c.name,
              value: c.uid.toString(),
            }))}
          />
          {has_services && (
            <Select
              label="Service"
              placeholder="Select service..."
              name="service"
              value={search_params.get("service")}
              onChange={(v) => setSearchParams(v ? { category: category_uid, service: v } : undefined)}
              data={services}
            />
          )}
          {has_options && (
            <Select
              label="Option"
              placeholder="Select option..."
              name="option"
              value={search_params.get("option")}
              onChange={(v) =>
                setSearchParams(v ? { category: category_uid, service: service_uid, option: v } : undefined)
              }
              data={options}
            />
          )}
        </Flex>
      </Box>
      <Map provider={osm} height={window.innerHeight} defaultCenter={[47.43622, -72.77654]} defaultZoom={6}>
        <ZoomControl style={{ top: 100 }} />
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
            <Card ref={setCardRef} shadow="sm" pt="xs" pb="sm" px="sm" radius="md" withBorder w={248}>
              <Flex justify="space-between" mb="xs">
                <Text size="sm" color="dimmed">
                  {cities.find((c) => c.uid === outlet?.city_uid)?.nom}
                </Text>
                <Flex justify="flex-end">
                  <CloseButton size="xs" onClick={() => setOutlet(null)} />
                </Flex>
              </Flex>
              <Text size="sm" mb="sm">
                {outlet.name}
              </Text>
              <Button
                variant="light"
                fullWidth
                onClick={() => {
                  open();
                  setCalendarLoading(!!outlet?.service_point || !errors_to_message[outlet?.service_point]);
                }}>
                Look for next availability
              </Button>
            </Card>
          </Overlay>
        )}
      </Map>
      <Drawer position="right" opened={opened} onClose={close}>
        <Flex direction="column" gap="md">
          <Text>Please book an appointment on the SAAQ website. This app is only for information purposes.</Text>
          <Button
            variant="light"
            fullWidth
            onClick={() => window.open("https://saaq.gouv.qc.ca/en/find-service-outlet", "_blank")}>
            Book an appointment
          </Button>
          {!outlet?.service_point || errors_to_message[outlet?.service_point] ? (
            <Text align="center">
              <strong>
                Sorry, this outlet does not support online booking.
                {outlet?.service_point && `Status: ${errors_to_message[outlet?.service_point]}`}
              </strong>
            </Text>
          ) : (
            <Box pos="relative">
              <LoadingOverlay visible={calendar_loading} overlayBlur={2} />
              <iframe
                onLoad={() => setCalendarLoading(false)}
                style={{ width: "100%", height: "calc(100vh - 190px)", flexGrow: 1 }}
                src={`https://outlook.office365.com/owa/calendar/${outlet?.service_point}@saaq.onmicrosoft.com/bookings/`}
              />
            </Box>
          )}
        </Flex>
      </Drawer>
    </Box>
  );
};

export default Saaq;
