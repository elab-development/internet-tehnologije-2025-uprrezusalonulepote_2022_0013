import { render, screen } from "@testing-library/react";
import HomePage from "../app/page";

jest.mock("next/link", () => {
  return ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

jest.mock("@/components/ExchangeRate", () => () => (
  <div data-testid="exchange-rate">ExchangeRate</div>
));

jest.mock("@/components/UnsplashGallery", () => () => (
  <div data-testid="unsplash-gallery">UnsplashGallery</div>
));

describe("Home page", () => {
  it("prikazuje osnovne elemente i navigaciju", () => {
    render(<HomePage />);

    // Naslov i uvod
    expect(
      screen.getByRole("heading", { name: /salon lepote/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/dobrodošla! izaberi šta želiš da uradiš\./i)
    ).toBeInTheDocument();

    // Kartice (naslovi) - precizno (string), da ne hvata više elemenata
    expect(screen.getByText("Zakazivanje termina")).toBeInTheDocument();
    expect(screen.getByText("Usluge")).toBeInTheDocument();
    expect(screen.getByText("Admin panel")).toBeInTheDocument();
    expect(screen.getByText("Nalog")).toBeInTheDocument();

    // Dugmad - po tačnom tekstu
    expect(
      screen.getByRole("button", { name: "Idi na Termine" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Idi na Usluge" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Idi na Admin" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Registracija" })
    ).toBeInTheDocument();

    // Mockovane komponente
    expect(screen.getByTestId("exchange-rate")).toBeInTheDocument();
    expect(screen.getByTestId("unsplash-gallery")).toBeInTheDocument();
  });

  it("ima linkove ka ključnim rutama", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("link", { name: "Idi na Termine" })
    ).toHaveAttribute("href", "/appointments");

    expect(
      screen.getByRole("link", { name: "Idi na Usluge" })
    ).toHaveAttribute("href", "/services");

    expect(
      screen.getByRole("link", { name: "Idi na Admin" })
    ).toHaveAttribute("href", "/admin");

    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login"
    );

    expect(
      screen.getByRole("link", { name: "Registracija" })
    ).toHaveAttribute("href", "/register");
  });
});