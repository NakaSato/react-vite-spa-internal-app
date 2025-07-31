import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, Star, Share, MoreVert } from "@mui/icons-material";

/**
 * TailwindMUIDemo - Demonstrates how to use Tailwind CSS classes with MUI components
 *
 * This component showcases the hybrid approach of combining:
 * - MUI components for complex UI elements
 * - Tailwind classes for spacing, colors, typography, and layout
 */
export const TailwindMUIDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <Typography variant="h4" className="mb-2 font-bold text-gray-900">
            MUI + Tailwind Integration Demo
          </Typography>
          <Typography variant="subtitle1" className="max-w-2xl text-gray-600">
            This demo shows how to effectively combine Material-UI components
            with Tailwind CSS utility classes for rapid, consistent UI
            development.
          </Typography>
        </div>

        {/* Grid Layout with Tailwind */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Basic Layout */}
          <Card className="transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  Project Alpha
                </Typography>
                <Chip
                  label="Active"
                  color="success"
                  size="small"
                  className="font-medium"
                />
              </div>

              <Typography
                variant="body2"
                className="mb-4 leading-relaxed text-gray-600"
              >
                Using Tailwind for spacing and typography with MUI Card
                component for structure.
              </Typography>

              <div className="mb-4 flex items-center space-x-2">
                <Avatar className="h-8 w-8 bg-blue-500">A</Avatar>
                <Avatar className="h-8 w-8 bg-green-500">B</Avatar>
                <Avatar className="h-8 w-8 bg-purple-500">C</Avatar>
                <span className="ml-2 text-sm text-gray-500">+5 more</span>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="contained"
                  size="small"
                  className="bg-blue-600 normal-case hover:bg-blue-700"
                >
                  View Details
                </Button>
                <div className="flex space-x-1">
                  <IconButton
                    size="small"
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <Star />
                  </IconButton>
                  <IconButton
                    size="small"
                    className="text-gray-500 hover:text-green-600"
                  >
                    <Share />
                  </IconButton>
                  <IconButton
                    size="small"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MoreVert />
                  </IconButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Status Indicators */}
          <Card className="border-l-4 border-orange-500 transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <Typography
                    variant="h6"
                    className="mb-1 font-semibold text-gray-800"
                  >
                    Solar Installation
                  </Typography>
                  <Chip
                    label="In Progress"
                    className="bg-orange-100 text-orange-800"
                    size="small"
                  />
                </div>
                <div className="text-right">
                  <Typography variant="body2" className="text-gray-500">
                    Progress
                  </Typography>
                  <Typography
                    variant="h6"
                    className="font-bold text-orange-600"
                  >
                    67%
                  </Typography>
                </div>
              </div>

              {/* Progress Bar using Tailwind */}
              <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                  style={{ width: "67%" }}
                ></div>
              </div>

              <Typography variant="body2" className="mb-4 text-gray-600">
                Installation phase is 67% complete. Expected completion by next
                week.
              </Typography>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outlined"
                    size="small"
                    className="border-gray-300 normal-case"
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className="border-red-300 normal-case text-red-600 hover:bg-red-50"
                  >
                    <Delete className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Statistics */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <Typography variant="h6" className="font-semibold">
                  Monthly Stats
                </Typography>
                <div className="rounded-full bg-white bg-opacity-20 p-2">
                  <Add className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Typography variant="body2" className="mb-1 opacity-90">
                    Total Projects
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    24
                  </Typography>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body2" className="mb-1 opacity-90">
                      Completed
                    </Typography>
                    <Typography variant="h6" className="font-semibold">
                      18
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" className="mb-1 opacity-90">
                      In Progress
                    </Typography>
                    <Typography variant="h6" className="font-semibold">
                      6
                    </Typography>
                  </div>
                </div>
              </div>

              <Button
                variant="contained"
                className="mt-4 w-full bg-white font-medium normal-case text-blue-600 hover:bg-gray-50"
              >
                View All Projects
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Showcase Section */}
        <Paper className="mb-8 p-8">
          <Typography variant="h5" className="mb-6 font-bold text-gray-900">
            Key Features of This Integration
          </Typography>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <Typography
                variant="h6"
                className="mb-3 flex items-center font-semibold text-gray-800"
              >
                <span className="mr-3 h-2 w-2 rounded-full bg-green-500"></span>
                Utility-First Styling
              </Typography>
              <Typography
                variant="body2"
                className="mb-4 leading-relaxed text-gray-600"
              >
                Use Tailwind classes for spacing (
                <code className="rounded bg-gray-100 px-1">p-6</code>,{" "}
                <code className="rounded bg-gray-100 px-1">mb-4</code>), colors
                (<code className="rounded bg-gray-100 px-1">text-gray-600</code>
                , <code className="rounded bg-gray-100 px-1">bg-blue-500</code>
                ), and layout (
                <code className="rounded bg-gray-100 px-1">flex</code>,{" "}
                <code className="rounded bg-gray-100 px-1">grid</code>) while
                keeping MUI for complex components.
              </Typography>
            </div>

            <div>
              <Typography
                variant="h6"
                className="mb-3 flex items-center font-semibold text-gray-800"
              >
                <span className="mr-3 h-2 w-2 rounded-full bg-blue-500"></span>
                Responsive Design
              </Typography>
              <Typography
                variant="body2"
                className="mb-4 leading-relaxed text-gray-600"
              >
                Tailwind's responsive prefixes (
                <code className="rounded bg-gray-100 px-1">md:</code>,{" "}
                <code className="rounded bg-gray-100 px-1">lg:</code>) work
                seamlessly with MUI's responsive props. Use both approaches
                based on complexity needs.
              </Typography>
            </div>

            <div>
              <Typography
                variant="h6"
                className="mb-3 flex items-center font-semibold text-gray-800"
              >
                <span className="mr-3 h-2 w-2 rounded-full bg-purple-500"></span>
                Theme Consistency
              </Typography>
              <Typography
                variant="body2"
                className="mb-4 leading-relaxed text-gray-600"
              >
                Tailwind config is customized to match MUI's design tokens.
                Colors, spacing, and typography scales are aligned for
                consistent design language.
              </Typography>
            </div>

            <div>
              <Typography
                variant="h6"
                className="mb-3 flex items-center font-semibold text-gray-800"
              >
                <span className="mr-3 h-2 w-2 rounded-full bg-orange-500"></span>
                Performance Optimized
              </Typography>
              <Typography
                variant="body2"
                className="mb-4 leading-relaxed text-gray-600"
              >
                Tailwind's purge feature removes unused styles, while MUI's
                tree-shaking ensures only used components are bundled. Best of
                both worlds.
              </Typography>
            </div>
          </div>
        </Paper>

        {/* Code Examples */}
        <Paper className="p-8">
          <Typography variant="h5" className="mb-6 font-bold text-gray-900">
            Usage Examples
          </Typography>

          <div className="space-y-6">
            <div>
              <Typography
                variant="h6"
                className="mb-2 font-semibold text-gray-800"
              >
                Layout & Spacing
              </Typography>
              <Box className="overflow-x-auto rounded-lg bg-gray-100 p-4 font-mono text-sm">
                <pre className="text-gray-800">
                  {`// ✅ Good - Use Tailwind for common spacing and layout
<Card className="p-6 mb-4 hover:shadow-lg transition-shadow">
  <div className="flex items-center justify-between mb-4">
    <Typography variant="h6">Title</Typography>
    <Chip label="Status" />
  </div>
</Card>`}
                </pre>
              </Box>
            </div>

            <div>
              <Typography
                variant="h6"
                className="mb-2 font-semibold text-gray-800"
              >
                Responsive Grid
              </Typography>
              <Box className="overflow-x-auto rounded-lg bg-gray-100 p-4 font-mono text-sm">
                <pre className="text-gray-800">
                  {`// ✅ Good - Tailwind grid with MUI components
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Content */}
      </CardContent>
    </Card>
  ))}
</div>`}
                </pre>
              </Box>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default TailwindMUIDemo;
